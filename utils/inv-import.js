var config =  require('../config.js');
var fs = require('fs');
var nano = require('nano')(config.couchAuthDbURL);
var maindb = nano.use('main');
var moment = require('moment');
var parse = require('csv-parse');
var uuid = require('node-uuid');
var inventoryMap = {
};

var locationMap = {
};

var aisleMap = {
};

var types = {};
var units = {};
var inventoryToImport;
var numItems = 0;
var friendlyIdsUsed = {};
var importDateReceived;

var parser = parse({columns: true, trim: true, auto_parse: true}, function(err, data) {
  if (err) {
    console.log('Error parsing csv file:', err);
  } else {
    inventoryToImport = data;
    processItem(inventoryToImport.shift());
  }
});
if (process.argv.length < 4) {
  console.log('Usage: node inv-import.js file.csv 2015-12-31');
} else {
  importDateReceived = moment(process.argv[3]).toDate();
  fs.createReadStream(process.argv[2]).pipe(parser);
}

function convertToInt(number) {
  if (number) {
    if (number.replace) {
      number = number.replace(',','');
    }
    return parseInt(number);
  } else {
    return 0;
  }
}

function isEmpty(obj) {
  if (!obj || obj === '') {
    return true;
  } else {
    return false;
  }
}

function formatLocationName(location, aisleLocation) {
  var locationName = '';
  if (!isEmpty(location)) {
    locationName += location;
    if (!isEmpty(aisleLocation)) {
      locationName += ' : ';
    }
  }
  if (!isEmpty(aisleLocation)) {
    locationName += aisleLocation;
  }
  return locationName;
}

function addPurchase(csvItem, inventoryDetails, callback) {
  var purchaseId = 'inv-purchase_' + uuid.v4();
  var newPurchase = {
    _id: purchaseId,
    aisleLocation: csvItem.aisleLocation,
    currentQuantity: convertToInt(csvItem.quantity),
    dateReceived: importDateReceived,
    inventoryItem: inventoryDetails.item._id,
    originalQuantity: convertToInt(csvItem.quantity),
    purchaseCost: convertToInt(csvItem.purchaseCost),
    lotNumber: csvItem.lotNumber,
    location: csvItem.location,
    vendor: csvItem.vendor,
    vendorItemNo: csvItem.vendorItemNo
  };
  if (!isEmpty(csvItem.expirationDate)) {
    newPurchase.expirationDate = moment(csvItem.expirationDate, 'MM/DD/YY').toDate();
  }
  if (csvItem.giftInKind === 'Yes') {
    newPurchase.giftInKind = true;
  }
  inventoryDetails.item.quantity += newPurchase.currentQuantity;

  if (newPurchase.currentQuantity === 0 && inventoryDetails.item.purchases && inventoryDetails.item.purchases.length > 0) {
    // Don't save a purchase of zero quantity if the item already exists
    console.log('Skipping purchase because of zero quantity and it already exists: ',csvItem);
    callback();
  } else {
    // Insert purchase
    updateRecord(newPurchase, function(err) {
      if (err) {
        callback(err);
      } else {
        if (!inventoryDetails.item.purchases) {
          inventoryDetails.item.purchases = [];
        }
        inventoryDetails.item.purchases.push(purchaseId);
        // Update insert location
        addPurchaseToLocation(inventoryDetails, newPurchase, function(err) {
          // Update inventory item
          if (err) {
            callback(err);
          } else {
            updateRecord(inventoryDetails.item, callback);
          }
        });
      }
    });
  }
}

function updateRecord(record, callback) {
  var updateParams = record._id;
  maindb.insert(record, updateParams, function(err, body) {
    if (err) {
      callback(err);
    } else {
      record._id = body.id;
      record._rev = body.rev;
      callback(null, record);
    }
  });
}

function addPurchaseToLocation(inventoryDetails, purchase, callback) {
  var locationToFind = formatLocationName(purchase.location, purchase.aisleLocation);
  var locationRecord = inventoryDetails.locations[locationToFind];
  if (inventoryDetails.locations[locationToFind]) {
    locationRecord.quantity += purchase.originalQuantity;
  } else {
    var locationId = 'inv-location_' + uuid.v4();
    locationRecord = {
      _id: locationId,
      aisleLocation: purchase.aisleLocation,
      location: purchase.location,
      quantity: purchase.originalQuantity
    };
    if (!inventoryDetails.item.locations) {
      inventoryDetails.item.locations = [];
    }
    inventoryDetails.item.locations.push(locationId);
    inventoryDetails.locations[locationToFind] = locationRecord;
  }
  updateRecord(locationRecord, callback);
}

function processItem(item) {
  if (item) {
    handleItem(item, function(err) {
      if (err) {
        console.log('Got error while processing item', item, err);
      } else {
        if (!aisleMap[item.aisleLocation]) {
          aisleMap[item.aisleLocation] = true;
        }
        if (!locationMap[item.location]) {
          locationMap[item.location] = true;
        }
      }
      numItems++;
      processItem(inventoryToImport.shift());
    });
  } else {
    console.log('DONE, processed ' + numItems);
    updateLocations(function(err) {
      if (err) {
        console.log('Error updating locations: ', err);
      } else {
        console.log('SUCCESS updating locations.');
      }
    });
  }
}

function handleItem(item, callback) {
  var inventoryDetails = inventoryMap[item.name];
  if (!inventoryDetails) {
    createInventoryItem(item, function(err, newInventoryItem) {
      if (err) {
        console.log('Error inserting inventory item:', err);
        callback(err);
      } else {
        var inventoryDetails = {
          item: newInventoryItem,
          locations: {}
        };
        inventoryMap[item.name] = inventoryDetails;
        addPurchase(item, inventoryDetails, callback);
      }
    });
  } else {
    addPurchase(item, inventoryDetails, callback);
  }
}

function insertInventoryItem(item, callback) {
  getFriendlyId(item, function(err, id) {
    if (err) {
      console.log('Error getting friendlyId: ', err);
      callback(err);
    } else {
      friendlyIdsUsed[id] = true;
      item.friendlyId = id;
      item._id = generateId();
      updateRecord(item, callback);
    }
  });
}

function getFriendlyId(item, callback) {
  maindb.get('sequence_inventory_' + item.type, function(err, sequence) {
    if (err) {
      findSequence(item.type, function(err, sequence) {
        if (err) {
          callback(err);
        } else {
          generateFriendlyId(sequence, callback);
        }
      });
    } else {
      generateFriendlyId(sequence, callback);
    }
  });
}

function buildFriendlyId(sequence) {
  var friendlyId = sequence.prefix;
  sequence.value += 1;
  if (sequence.value < 100000) {
    friendlyId += String('00000' + sequence.value).slice(-5);
  } else {
    friendlyId += sequence.value;
  }
  return friendlyId;
}

function generateFriendlyId(sequence, callback) {
  var friendlyId;
  while (!friendlyId || friendlyIdsUsed[friendlyId]) {
    friendlyId = buildFriendlyId(sequence);
  }
  updateRecord(sequence, function(err) {
    if (err) {
      console.log('ERROR INSERTING SEQUENCE',err);
      callback(err);
    } else {
      callback(null, friendlyId);
    }
  });
}

function generateId() {
  var min = 1;
  var max = 999;
  var part1 = new Date().getTime();
  var part2 = Math.floor(Math.random() * (max - min + 1)) + min;
  return 'inventory_' + part1.toString(36) + '_' + part2.toString(36);
}

function createInventoryItem(item, callback) {
  var inventoryItem = {
    name: item.name,
    distributionUnit: item.distributionUnit,
    quantity: 0, // Quantity gets added via purchases
    type: item.type,
    crossReference: item.crossReference
  };
  if (!types[item.type]) {
    types[item.type] = true;
  }
  if (!units[item.distributionUnit]) {
    units[item.distributionUnit] = true;
  }
  insertInventoryItem(inventoryItem, callback);
}

function findSequence(type, callback) {
  checkNextSequence(type, 0, function(err, prefixChars) {
    var newSequence = {
      _id: 'sequence_inventory_' + type,
      prefix: type.toLowerCase().substr(0,prefixChars),
      value: 0
    };
    callback(null, newSequence);
  });
}

function findSequenceByPrefix(type, prefixChars, callback) {
  maindb.list({
    key: 'prefix',
    startskey: type.toLowerCase().substr(0,prefixChars)
  }, callback);
}

function checkNextSequence(type, prefixChars, callback) {
  prefixChars++;
  findSequenceByPrefix(type, prefixChars, function(err, result) {
    if (err) {
      console.log('error finding by prefix: ' + prefixChars,err);
      callback(err);
    } else {
      if (result.rows.length > 0) {
        checkNextSequence(type, prefixChars, callback);
      } else {
        // Record doesn't exist, use current prefix
        callback(null, prefixChars);
      }
    }
  });
}

function locationMatch(locations, location) {
  var foundMatch = false;
  for (var i = 0; i < locations.length; i++) {
    if (locations[i] === location) {
      foundMatch = true;
      break;
    }
  }
  return foundMatch;
}

function addNewLocations(listname, locationMap, callback) {
  maindb.get(listname, function(err, list) {
    if (err) {
      list = {
        _id: listname,
        value: []
      };
    }
    var updateList = false;
    for (var location in locationMap) {
      if (location && location !== '') {
        var existingLocation = locationMatch(list.value, location);
        if (!existingLocation) {
          console.log('location doesn\'t exist adding: ',location);
          list.value.push(location);
          updateList = true;
        }
      }
    }
    if (updateList) {
      updateRecord(list, callback);
    } else {
      callback();
    }
  });
}

function updateLocations(callback) {
  addNewLocations('lookup_warehouse_list', locationMap, function(err) {
    if (err) {
      callback(err);
    }
    addNewLocations('lookup_aisle_location_list', aisleMap, callback);
  });
}

