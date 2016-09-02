var config =  require('../config.js');
var nano = require('nano')(config.couchAuthDbURL);
var maindb = nano.use('main');
var relPouch = require('relational-pouch');
var allIds = [];
var objectMap = {};
var idsToUpdate = [];
var passNumber = 0;
var haveDeletedItems = false;
var unknownObjects = [];
var deletedIds = [];

var schema = {
  appointment: [{
    key: 'patient'
  },
  {
    key: 'visits',
    rel: 'hasMany',
    objType: 'visit'
  }],
  billingLineItem: [{
    key: 'details',
    rel: 'hasMany',
    objType: 'lineItemDetail'
  }],
  imaging: [{
    key: 'pricing'
  }, {
    key: 'patient'
  }, {
    key: 'visit'
  }, {
    key: 'charges',
    rel: 'hasMany',
    objType: 'procCharge'
  }],
  inventory: [{
    key: 'purchases',
    rel: 'hasMany',
    objType: 'invPurchase'
  }, {
    key: 'locations',
    rel: 'hasMany',
    objType: 'invLocation'
  }],
  invPurchase: [{
    key: 'inventoryItem',
    objType: 'inventory'
  }],
  invRequest: [{
    key: 'inventoryItem',
    objType: 'inventory'
  }, {
    key: 'patient'
  }, {
    key: 'visit'
  }],
  invoice: [{
    key: 'patient'
  }, {
    key: 'visit'
  }, {
    key: 'paymentProfile',
    objType: 'priceProfile'
  }, {
    key: 'payments',
    rel: 'hasMany',
    objType: 'payment'
  }, {
    key: 'lineItems',
    rel: 'hasMany',
    objType: 'billingLineItem'
  }],
  lab: [{
    key: 'labType',
    objType: 'pricing'
  }, {
    key: 'patient'
  }, {
    key: 'visit'
  }, {
    key: 'charges',
    rel: 'hasMany',
    objType: 'proc-charge'
  }],
  lineItemDetail: [{
    key: 'pricingItem',
    objType: 'pricing'
  }],
  medication: [{
    key: 'inventoryItem',
    objType: 'inventory'
  }, {
    key: 'patient'
  }, {
    key: 'visit'
  }],
  overridePrice: [{
    key: 'profile',
    objType: 'priceProfile'
  }],
  patientNote: [{
    key: 'patient'
  }, {
    key: 'visit'
  }],
  patient: [{
    key: 'paymentProfile',
    objType: 'priceProfile'
  }, {
    key: 'payments',
    rel: 'hasMany',
    objType: 'payment'
  }],
  payment: [{
    key: 'invoice'
  }],
  photo: [{
    key: 'patient'
  }],
  pricing: [{
    key: 'pricingOverrides',
    rel: 'hasMany',
    objType: 'override-price'
  }],
  procCharge: [{
    key: 'medication',
    objType: 'inventory'
  }, {
    key: 'pricingItem',
    objType: 'pricing'
  }],
  procedure: [{
    key: 'visit'
  }, {
    key: 'charges',
    rel: 'hasMany',
    objType: 'procCharge'
  }],
  visit: [{
    key: 'patient'
  }, {
    key: 'charges',
    rel: 'hasMany',
    objType: 'procCharge'
  }, {
    key: 'imaging',
    rel: 'hasMany'
  }, {
    key: 'labs',
    rel: 'hasMany',
    objType: 'lab'
  }, {
    key: 'medication',
    rel: 'hasMany'
  }, {
    key: 'patientNotes',
    rel: 'hasMany',
    objType: 'patientNote'
  }, {
    key: 'procedures',
    rel: 'hasMany',
    objType: 'procedure'
  }, {
    key: 'vitals',
    rel: 'hasMany',
    objType: 'vital'
  }]
};

var invLocations = {};


relPouch.setSchema([]);
maindb.list({startkey: 'appointment_2_', include_docs: true}, function(err, results) {
  if (!err) {
    console.log('Fetched ' + results.rows.length + ' out of ' + results.total_rows);
    results.rows.forEach(function(result) {
      objectMap[result.id] = result.doc;
      allIds.push(result.id);
    });
    checkRecords();
  } else {
    console.log('ERROR', err);
  }
});

function checkRecords() {
  allIds.forEach(checkRecord);
  if (haveDeletedItems) {
    ++passNumber;
    haveDeletedItems = false;
    console.log('Update items length:' + idsToUpdate.length);
    console.log('Finished pass number ' + passNumber + ', scanning for cascading records affected.');
    allIds = [];
    for (var anId in objectMap) {
      if (!objectMap[anId]._deleted) {
        allIds.push(anId);
      }
    }
    checkRecords();
  } else {
    for (var locationId in invLocations) {
      var location = invLocations[locationId];
      if (!location.usedRecord) {
        location._deleted = true;
        deletedIds.push(locationId);
        addIdToUpdate(locationId);
      }
    }
    if (idsToUpdate.length > 0) {
      console.log('Updating ids: ' + idsToUpdate.length);
      var objectsToUpdate = idsToUpdate.map(function(updateId) {
        return objectMap[updateId];
      });
      maindb.bulk({ docs: objectsToUpdate}, function(err, response) {
        if (err) {
          console.log('error updating records: ', JSON.stringify(err, null, 2));
        } else {
          console.log('success updating records: ', JSON.stringify(response, null, 2));
          console.log('Unknown types:' + JSON.stringify(unknownObjects));
          console.log('Done');
        }
      });
    }

    process.exit();

  }
}

function checkRecord(dbId) {
  var doc = objectMap[dbId];
  var parsedId = relPouch.rel.parseDocID(dbId);
  var modelRelationships = schema[parsedId.type];
  if (modelRelationships) {
    modelRelationships.forEach(function(relationship) {
      var value = doc.data[relationship.key];
      var objType = relationship.objType || relationship.key;
      if (value) {
        if (relationship.rel === 'hasMany') {
          var refIds = [];
          value.forEach(function(refId) {
            var lookupId = getPouchId(refId, objType);
            if (objectMap[lookupId]) {
              refIds.push(refId);
              if (objType === 'inventory' && relationship.key === 'locations') {
                if (invLocations[lookupId]) {
                  invLocations[lookupId].usedRecord = true;
                }
              }
            }
          });
          if (refIds.length < value.length) {
            doc.data[relationship.key] = refIds;
            addIdToUpdate(dbId);
            console.log('Updating ' + dbId + ' attribute ' + relationship.key + ' with values: ' + JSON.stringify(refIds));
          }
        } else {
          var lookupID = getPouchId(value, objType);
          if (!objectMap[lookupID]) {
            doc._deleted = true;
            haveDeletedItems = true;
            deletedIds.push(dbId);
            addIdToUpdate(dbId);
          }
        }
      }
    });
  } else {
    if (parsedId.type === 'invLocation') {
      invLocations[dbId] = doc;
    } else {
      if (unknownObjects.indexOf(parsedId.type) === -1) {
        console.log('Do not have modelRelationships for:' + parsedId.type);
        unknownObjects.push(parsedId.type);
      }
    }
  }
}

function addIdToUpdate(id) {
  if (idsToUpdate.indexOf(id) === -1) {
    idsToUpdate.push(id);
  }
}

function getPouchId(dbId, objType) {
  return relPouch.rel.makeDocID({
    id: dbId,
    type: objType
  });
}
