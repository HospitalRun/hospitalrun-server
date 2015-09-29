var camelize = require('camelize'),    
    config =  require('../config.js'),
    nano = require('nano')(config.couch_auth_db_url),    
    newdb,    
    olddb,
    relPouch =require('relational-pouch');

if (process.argv.length < 4) {
    console.log('Usage: node pouch-mig.js olddb newdb');
} else {
    olddb = nano.use(process.argv[2]);
    newdb = nano.use(process.argv[3]);
    relPouch.setSchema([]);
    migrateRecords();
}

function migrateRecords() {
  var newDocs = [];
  olddb.list({
    startkey: 'appointment',
    include_docs:true,    
  }, function(err, results) {
    results.rows.forEach(function(result) {
      var parsedId = parseOldId(result.id);
      var newDocId = getNewId(parsedId);
      var newDoc = {
        _id: newDocId,
        data: result.doc
      };
      delete newDoc.data._rev;
      
      switch(parsedId.doctype) {
        case 'appointment': {
          updateChildId(newDoc.data, 'patient');
          break;
        }
        case 'billing-line-item': {
          updateChildId(newDoc.data, 'details'); 
          break;
        }
        case 'imaging': {
          updateChildId(newDoc.data, 'charges');
          updateChildId(newDoc.data, 'imagingType');
          updateChildId(newDoc.data, 'patient');
          updateChildId(newDoc.data, 'visit');
          break;
        }
        case 'inventory': {
          updateChildId(newDoc.data, 'locations');
          updateChildId(newDoc.data, 'purchases');
          newDoc.data.inventoryType = newDoc.data.type;
          delete newDoc.data.type;
          break;
        }
        case 'inv-purchase': {
          updateChildId(newDoc.data, 'inventoryItem');
          break;
        }
        case 'inv-request': {
          updateChildId(newDoc.data, 'inventoryItem');
          updateChildId(newDoc.data, 'patient');
          updateChildId(newDoc.data, 'visit');
          break;
        }
        case 'invoice': {
          updateChildId(newDoc.data, 'lineItems');
          updateChildId(newDoc.data, 'patient');
          updateChildId(newDoc.data, 'paymentProfile');
          updateChildId(newDoc.data, 'payments');
          updateChildId(newDoc.data, 'visit');
          break;
        }
        case 'lab': {
          updateChildId(newDoc.data, 'charges');
          updateChildId(newDoc.data, 'labType');
          updateChildId(newDoc.data, 'patient');
          updateChildId(newDoc.data, 'visit');
          break;
        }
          
        case 'line-item-detail': {
          updateChildId(newDoc.data, 'pricingItem');
          break;
        }
        
        case 'medication': {
          updateChildId(newDoc.data, 'inventoryItem');
          updateChildId(newDoc.data, 'patient');
          updateChildId(newDoc.data, 'visit');
          break;
        }
        
        case 'override-price': {
          updateChildId(newDoc.data, 'profile');
          break;
        }
          
        case 'patient': {
          updateChildId(newDoc.data, 'paymentProfile');
          updateChildId(newDoc.data, 'payments');
          break;
        }          
          
        case 'payment': {
          updateChildId(newDoc.data, 'invoice');
          newDoc.data.paymentType = newDoc.data.type;
          delete newDoc.data.type;
          break;          
        }
          
        case 'photo': {
          updateChildId(newDoc.data, 'patient');
          break;
        }
          
        case 'pricing': {
          updateChildId(newDoc.data, 'pricingOverrides');
          newDoc.data.pricingType = newDoc.data.type;
          delete newDoc.data.type;
          break;
        }
          
        case 'proc-charge': {
          updateChildId(newDoc.data, 'medication');
          updateChildId(newDoc.data, 'pricingItem');          
          break;
        }
          
        case 'procedure': {
          updateChildId(newDoc.data, 'charges');
          updateChildId(newDoc.data, 'visit');
          break;
        }
        
        case 'visit': {
          updateChildId(newDoc.data, 'charges');
          updateChildId(newDoc.data, 'imaging');
          updateChildId(newDoc.data, 'labs');
          updateChildId(newDoc.data, 'medication');
          updateChildId(newDoc.data, 'patient');
          updateChildId(newDoc.data, 'procedures');
          updateChildId(newDoc.data, 'vitals');
          break;
        }          
      }
      newDocs.push(newDoc);
    });
    newdb.bulk({docs:newDocs}, function(err, body) {
      if(err) {
        console.log("ERROR ON INSERT:",err,body);
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
  var parsedId = {},
      uidx;      
  if ((uidx = oldId.indexOf("_")) > 0) {
    parsedId.doctype = oldId.substring(0, uidx);
    parsedId.id = oldId.substring(uidx+1);
  }
  return parsedId;
}

function updateChildId(data, field) {
  if (data[field]) {
    if (Array.isArray(data[field])) {
      data[field] = data[field].map(function(key) {
        return transformId(key);
      });
    } else {
      data[field] = transformId(data[field]);
    }    
  }
}

function transformId(oldValue) {
  var parsedId = parseOldId(oldValue);
  if (!parsedId.id) {
    console.log("ERROR PARSING ID:"+oldValue);
  } else {
    return parsedId.id;
  }
}