    var config =  require('../config.js'), 
        fs = require('fs'),
        nano = require('nano')(config.couch_auth_db_url),
        maindb = nano.use('main'),
        moment = require('moment'),
        parse = require('csv-parse'),
        uuid = require('node-uuid');
    
    var inventoryMap = {
    };
    
    var types = {};
    var units = {};
    var inventoryToImport;
    var numItems = 0;
    

    var parser = parse({columns:true, trim: true, auto_parse: true}, function(err, data){
        if (err) {
            console.log('Error parsing csv file:', err);
        } else {
            inventoryToImport = data;
            processItem(inventoryToImport.shift());
        }    
    });
    if (process.argv.length < 2) {
        console.log('Usage: node inv-import.js file.csv');
    } else {
        fs.createReadStream(process.argv[2]).pipe(parser);
    }

    function convertToInt(number) {
        if (number) {
            if (number.replace) {
                number = number.replace(',','');
            }
            return parseInt(number);
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
                locationName += " : ";
            }
        }
        if (!isEmpty(aisleLocation)) {
            locationName += aisleLocation;
        }
        return locationName;
    }

    function addPurchase(csvItem, inventoryDetails, callback) {
        var purchaseId = 'inv-purchase_'+uuid.v4(),
            newPurchase = {
                _id: purchaseId,
                aisleLocation: csvItem.aisleLocation,
                currentQuantity: convertToInt(csvItem.quantity),
                dateReceived: moment('2014-11-01').toDate(),
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
                
        //Insert purchase
        updateRecord(newPurchase, function(err) {
            if(err) {
                callback(err);
            } else {
                if (!inventoryDetails.item.purchases) {
                    inventoryDetails.item.purchases = [];
                }
                inventoryDetails.item.purchases.push(purchaseId);
                //Update insert location
                addPurchaseToLocation(inventoryDetails, newPurchase, function(err){
                    //Update inventory item
                    if (err) {
                        callback(err);
                    } else {
                        updateRecord(inventoryDetails.item, callback);
                    }
                });
            }
        });
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
        var locationToFind = formatLocationName(purchase.location, purchase.aisleLocation),
            locationRecord = inventoryDetails.locations[locationToFind];
        if (inventoryDetails.locations[locationToFind]) {
            locationRecord.quantity += purchase.originalQuantity;
        } else {            
            var locationId = 'inv-location_'+uuid.v4();
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
                }
                numItems++;
                processItem(inventoryToImport.shift());
            });
        } else {
            console.log("DONE, processed "+numItems);
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
                    //console.log('inserted item', newInventoryItem);
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
                item.friendlyId = id;
                item._id = generateId();
                updateRecord(item, callback);
            }
        });
    }
    
    function getFriendlyId(item, callback) {
        maindb.get('sequence_inventory_'+item.type, function(err, sequence) {
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

    function generateFriendlyId(sequence, callback) {
        var friendlyId = sequence.prefix;
        sequence.value += 1;
        if (sequence.value < 100000) {
            friendlyId += String('00000' + sequence.value).slice(-5);
        } else {
            friendlyId += sequence.value;
        }
        updateRecord(sequence, function(err) {
            if(err) {
                console.log("ERROR INSERTING SEQUENCE",err);
                callback(err);
            } else {
                callback(null, friendlyId);
            }
        });
    }

    function generateId() {
        var min = 1,
            max = 999,
            part1 = new Date().getTime(),
            part2 = Math.floor(Math.random() * (max - min + 1)) + min;
        return 'inventory_'+part1.toString(36) +'_' + part2.toString(36);
    }    

    function createInventoryItem(item, callback) {
        var inventoryItem = {                
                name: item.name,
                distributionUnit: item.distributionUnit,
                quantity: 0, //Quantity gets added via purchases
                type: item.type                    
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
                _id: 'sequence_inventory_'+type,
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
                console.log('error finding by prefix: '+prefixChars,err);
                callback(err);
            } else {                
                if (result.rows.length > 0) {
                    checkNextSequence(type, prefixChars, callback);
                } else {
                    //Record doesn't exist, use current prefix
                    callback(null, prefixChars);
                }
            }
        });        
    }