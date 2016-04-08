var camelize = require('camelize');
var config =  require('../config.js');
var nano = require('nano')(config.couchAuthDbURL);
var newdb;
var olddb;
var relPouch = require('relational-pouch');

if (process.argv.length < 4) {
  console.log('Usage: node pouch-mig.js olddb newdb');
} else {
  olddb = nano.use(process.argv[2]);
  newdb = nano.use(process.argv[3]);
  relPouch.setSchema([]);
  migrateRecords();
}

var existingKeys = {};
var childKeys = [];

function migrateRecords() {
  var newDocs = [];
  olddb.list({
    startkey: 'appointment',
    include_docs: true,
  }, function(err, results) {
    results.rows.forEach(function(result) {
      var parsedId = parseOldId(result.id);
      var newDocId = getNewId(parsedId);
      var newDoc = {
        _id: newDocId,
        data: result.doc
      };
      existingKeys[newDocId] = true;
      delete newDoc.data._id;
      delete newDoc.data._rev;

      switch (parsedId.doctype) {
        case 'appointment': {
          updateChildId(newDoc, 'patient');
          break;
        }
        case 'billing-line-item': {
          updateChildId(newDoc, 'details');
          break;
        }
        case 'imaging': {
          updateChildId(newDoc, 'charges');
          updateChildId(newDoc, 'imagingType');
          updateChildId(newDoc, 'patient');
          updateChildId(newDoc, 'visit');
          break;
        }
        case 'inventory': {
          updateChildId(newDoc, 'locations');
          updateChildId(newDoc, 'purchases');
          newDoc.data.inventoryType = newDoc.data.type;
          delete newDoc.data.type;
          break;
        }
        case 'inv-purchase': {
          updateChildId(newDoc, 'inventoryItem');
          break;
        }
        case 'inv-request': {
          updateChildId(newDoc, 'inventoryItem');
          updateChildId(newDoc, 'patient');
          updateChildId(newDoc, 'visit');
          break;
        }
        case 'invoice': {
          updateChildId(newDoc, 'lineItems');
          updateChildId(newDoc, 'patient');
          updateChildId(newDoc, 'paymentProfile');
          updateChildId(newDoc, 'payments');
          updateChildId(newDoc, 'visit');
          break;
        }
        case 'lab': {
          updateChildId(newDoc, 'charges');
          updateChildId(newDoc, 'labType');
          updateChildId(newDoc, 'patient');
          updateChildId(newDoc, 'visit');
          break;
        }

        case 'line-item-detail': {
          updateChildId(newDoc, 'pricingItem');
          break;
        }

        case 'medication': {
          updateChildId(newDoc, 'inventoryItem');
          updateChildId(newDoc, 'patient');
          updateChildId(newDoc, 'visit');
          break;
        }

        case 'override-price': {
          updateChildId(newDoc, 'profile');
          break;
        }

        case 'patient': {
          updateChildId(newDoc, 'paymentProfile');
          updateChildId(newDoc, 'payments');
          updateSex(newDoc);
          break;
        }

        case 'payment': {
          updateChildId(newDoc, 'invoice');
          newDoc.data.paymentType = newDoc.data.type;
          delete newDoc.data.type;
          break;
        }

        case 'photo': {
          updateChildId(newDoc, 'patient');
          break;
        }

        case 'pricing': {
          updateChildId(newDoc, 'pricingOverrides');
          newDoc.data.pricingType = newDoc.data.type;
          delete newDoc.data.type;
          break;
        }

        case 'proc-charge': {
          updateChildId(newDoc, 'medication');
          updateChildId(newDoc, 'pricingItem');
          break;
        }

        case 'procedure': {
          updateChildId(newDoc, 'charges');
          updateChildId(newDoc, 'visit');
          break;
        }

        case 'visit': {
          updateChildId(newDoc, 'charges');
          updateChildId(newDoc, 'imaging');
          updateChildId(newDoc, 'labs');
          updateChildId(newDoc, 'medication');
          updateChildId(newDoc, 'patient');
          updateChildId(newDoc, 'procedures');
          updateChildId(newDoc, 'vitals');
          break;
        }
      }
      newDocs.push(newDoc);
    });
    newdb.bulk({docs: newDocs}, function(err, body) {
      if (err) {
        console.log('ERROR ON INSERT:',err,body);
      } else {
        console.log('Successfully migrated documents');
        deleteOrphanRecords();
      }
    });
  });
}

function deleteOrphanRecords() {
  var recordsToDelete = {};
  childKeys.forEach(function(keyInfo) {
    keyInfo.keys.forEach(function(key) {
      if (!existingKeys[key]) {
        if (!recordsToDelete[keyInfo.id]) {
          recordsToDelete[keyInfo.id] = true;
        }
      }
    });
  });
  var deleteKeys = Object.keys(recordsToDelete);
  deleteKeys.forEach(function(deleteKey) {
    newdb.get(deleteKey, function(err, doc) {
      if (err) {
        console.log('Err on get record to delete: ',err);
      } else {
        doc._deleted = true;
        newdb.insert(doc, function(err, result) {
          if (err) {
            console.log('Error deleting unneeded record:',err);
          } else {
            console.log('Deleted unneeded record:' + result.id);
          }
        });
      }
    });
  });
}

function getNewId(parsedId) {
  return relPouch.rel.makeDocID({
    id: parsedId.id,
    type: camelize(parsedId.doctype)
  });
}

function parseOldId(oldId) {
  var parsedId = {};
  var uidx;
  if ((uidx = oldId.indexOf('_')) > 0) {
    parsedId.doctype = oldId.substring(0, uidx);
    parsedId.id = oldId.substring(uidx + 1);
  }
  return parsedId;
}

function updateChildId(doc, field) {
  var data = doc.data;
  var childKeyValues = {
        id: doc._id,
        keys: []
      };
  if (data[field]) {
    if (Array.isArray(data[field])) {
      data[field] = data[field].map(function(key) {
        childKeyValues.keys.push(getNewId(parseOldId(key)));
        return transformId(key);
      });
    } else {
      childKeyValues.keys.push(getNewId(parseOldId(data[field])));
      data[field] = transformId(data[field]);
    }
    childKeys.push(childKeyValues);
  }
}

// Move sex from gender field
function updateSex(doc) {
  var gender = doc.data.gender;
  if (gender === 'M') {
    doc.data.sex = 'Male';
  } else if (gender === 'F') {
    doc.data.sex = 'Female';
  }
}

function transformId(oldValue) {
  var parsedId = parseOldId(oldValue);
  if (!parsedId.id) {
    console.log('ERROR PARSING ID:' + oldValue);
  } else {
    return parsedId.id;
  }
}
