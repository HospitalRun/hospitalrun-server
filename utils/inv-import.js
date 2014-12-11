    var config =  require('./config.js'), 
        fs = require('fs'),
        nano = require('nano')(config.couch_auth_db_url),
        maindb = nano.use('main'),
        parse = require('csv-parse');


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
    fs.createReadStream(__dirname+'/all.csv').pipe(parser);
    function addPurchase(item) {
            var newPurchase = this.getProperties('aisleLocation', 'dateReceived',
                'purchaseCost', 'lotNumber', 'expirationDate', 'giftInKind', 
                'location', 'vendor', 'vendorItemNo');
            newPurchase.originalQuantity = item.quantity;
            newPurchase.currentQuantity = newPurchase.originalQuantity;
            var purchase = this.get('store').createRecord('inv-purchase', newPurchase);
            //promises.push(purchase.save());
            this.get('purchases').addObject(purchase);
            this.newPurchaseAdded(this.get('model'), purchase);
        
    }
    
    function processItem(item) {
        console.log('in processItem with item',item);
        if (item) {
            handleItem(item, function(err) {
                if (err) {
                    console.log('Got error while processing item', item, err);
                }
                numItems++;
                if (numItems < 2) {
                    processItem(inventoryToImport.shift());
                }
            });
        } else {
            console.log("types: ",types);
            console.log("units: ",units);
            console.log("DONE");
        }
    }

    function handleItem(item, callback) {
        console.log('in handleItem, with item:',item.description);
        var newItem = true,                
            inventoryItem = inventoryMap[item.description];
        if (!inventoryItem) {
            console.log("Inventory item doesn't exist, so calling createInventoryItem");
            createInventoryItem(item, function(err, result) {
                if (err) {                    
                    console.log('Error inserting inventory item:', err);
                    callback(err);
                } else {
                    console.log('inserted item', result);
                //insert purchase 
                //update/insert location
                    
                }
                result = inventoryItem;
                callback();
            });
        } else {
            newItem = false;
            callback();
        }
    }
    
    function insertInventoryItem(item, callback) {
        console.log('in insertInventoryItem with item',item.description);
        getFriendlyId(item, function(err, id) {
            if (err) {
                console.log('Error getting friendlyId: ', err);
                callback(err);
            } else {
                item.friendlyId = id;                
                console.log("INSERT ITEM",item);                
                maindb.insert(item, generateId(), callback);
            }
        });
    }
    
    function getFriendlyId(item, callback) {
        console.log('in getFriendlyId, looking for sequence_inventory_'+item.type);
        maindb.get('sequence_inventory_'+item.type, function(err, sequence) {
            if (err) {
                console.log('in getFriendlyId, didnt find sequence_inventory_'+item.type);
                findSequence(item.type, function(err, sequence) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log("Created sequence",sequence);
                        generateFriendlyId(sequence, callback);
                    }
                });
            } else {
                console.log("Found sequence in db",sequence);
                generateFriendlyId(sequence, callback);
            }
        });
    }

    function generateFriendlyId(sequence, callback) {
        console.log('generating friendlyId using sequence',sequence);
        var friendlyId = sequence.prefix;
        sequence.value += 1;
        if (sequence.value < 100000) {
            friendlyId += String('00000' + sequence.value).slice(-5);
        } else {
            friendlyId += sequence.value;
        }
        var updateParams = {
            doc_name: sequence._id
        };
        if (sequence._rev) {
            updateParams.rev = sequence._rev;
        }
        
        delete sequence._id;
        delete sequence._rev;
        console.log("HEY INSERT", sequence, updateParams);
        
        maindb.insert(sequence, updateParams, function(err) {
            if(err) {
                console.log("ERROR INSERTING SEQUENCE",err);
                callback(err);
            } else {
                console.log("SUCCESS INSERTING SEQUENCE",friendlyId);
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
                description: item.description,
                distributionUnit: item.distributionUnit,
                quantity: item.quantity,
                type: item.type                    
            };
        if (!types[item.type]) {
            types[item.type] = true;
        }
        if (!units[item.distributionUnit]) {
            units[item.distributionUnit] = true;
        }
        console.log('created item, about to insert',inventoryItem);
        insertInventoryItem(inventoryItem, callback);
    }



    function findSequence(type, callback) {
        console.log('in findSequence for type:', type);
        checkNextSequence(type, 0, function(err, prefixChars) {            
            var newSequence = {
                _id: 'sequence_inventory_'+type,
                prefix: type.toLowerCase().substr(0,prefixChars),
                value: 0                
            };
            console.log('in findSequence, it looks like '+prefixChars+' is needed for prefix, newsequence is',newSequence);
            callback(null, newSequence);
        });
    }
    
    function findSequenceByPrefix(type, prefixChars, callback) {
        console.log('looking for prefix: '+type.toLowerCase().substr(0,prefixChars));
        maindb.list({
            key: 'prefix',
            startskey: type.toLowerCase().substr(0,prefixChars)
        }, callback);
    }
    
    function checkNextSequence(type, prefixChars, callback) {
        console.log('in checkNextSequence: ', type, prefixChars);
        prefixChars++;
        findSequenceByPrefix(type, prefixChars, function(err, result) {
            if (err) {                
                console.log('error finding by prefix: '+prefixChars,err);
                callback(err);
            } else {                
                console.log('found sequence for prefix: '+prefixChars, result);
                if (result.rows.length > 0) {
                    checkNextSequence(type, prefixChars, callback);
                } else {
                    //Record doesn't exist, use current prefix
                    callback(null, prefixChars);
                }
            }
        });        
    }
        
    /*_completeBeforeUpdate: function(sequence, resolve, reject) {
        var sequenceValue = null,
            friendlyId = sequence.get('prefix'),
            promises = [];
        
        if (this.get('showPurchases')) {
            var newPurchase = this.getProperties('aisleLocation', 'dateReceived',
                'purchaseCost', 'lotNumber', 'expirationDate', 'giftInKind', 
                'location', 'vendor', 'vendorItemNo');
            newPurchase.originalQuantity = this.get('quantity');
            newPurchase.currentQuantity = newPurchase.originalQuantity;
            var purchase = this.get('store').createRecord('inv-purchase', newPurchase);
            promises.push(purchase.save());
            this.get('purchases').addObject(purchase);
            this.newPurchaseAdded(this.get('model'), purchase);
        }
        sequence.incrementProperty('value',1);
        sequenceValue = sequence.get('value');
        if (sequenceValue < 100000) {
            friendlyId += String('00000' + sequenceValue).slice(-5);
        } else {
            friendlyId += sequenceValue;
        }
        this.set('friendlyId', friendlyId);
        promises.push(sequence.save());
        Ember.RSVP.all(promises,'All before update done for inventory item').then(function(){
            resolve();
        }, function(error) {
            reject(error);
        });
    },
    newPurchaseAdded: function(inventoryItem, newPurchase) {
        var aisle = newPurchase.get('aisleLocation'),
            location = newPurchase.get('location'),
            quantity = parseInt(newPurchase.get('originalQuantity'));
        this._addQuantityToLocation(inventoryItem, quantity, location, aisle);
    },
        
    _addQuantityToLocation: function(inventoryItem, quantity, location, aisle) {
        var foundLocation = false,
            locations = inventoryItem.get('locations');
        this.set('aisleToFind', aisle);
        this.set('locationToFind', location);
        
        foundLocation = locations.find(this.findLocation, this);
        if (foundLocation) {
            foundLocation.incrementProperty('quantity', quantity);
            foundLocation.save();
        } else {
            var locationRecord = this.get('store').createRecord('inv-location', {
                aisleLocation: aisle,
                location: location,
                quantity: quantity,
            });
            locationRecord.save();
            locations.addObject(locationRecord);
        }        
    },
     
    //INVENTORY
    purchases: DS.hasMany('inv-purchase'),
    locations: DS.hasMany('inv-location'),
    description: DS.attr('string'),
    friendlyId: DS.attr('string'),
    keywords: DS.attr(),
    name: DS.attr('string'),
    quantity: DS.attr('number'),
    crossReference: DS.attr('string'),
    type: DS.attr('string'),
    price: DS.attr('number'),
    reorderPoint: DS.attr('number'),
    distributionUnit: DS.attr('string'),
        
    //inv-location        
    quantity: DS.attr('number'),
    location: DS.attr('string'),
    aisleLocation: DS.attr('string'),
        
    //inv-purchase
    InventoryPurchaseItem = AbstractModel.extend(LocationName, {
    purchaseCost: DS.attr('number'), 
    lotNumber: DS.attr('string'),
    dateReceived: DS.attr('date'),
    costPerUnit: function() {
        var purchaseCost = this.get('purchaseCost'),
            quantity = parseInt(this.get('originalQuantity'));
        if (Ember.isEmpty(purchaseCost) || Ember.isEmpty(quantity)) {
            return 0;
        }
        return Number((purchaseCost/quantity).toFixed(2));
    }.property('purchaseCost', 'originalQuantity'),
    originalQuantity: DS.attr('number'),
    currentQuantity: DS.attr('number'),
    expirationDate: DS.attr('date'),
    expired: DS.attr('boolean'),
    location: DS.attr('string'),
    aisleLocation: DS.attr('string'),
    giftInKind: DS.attr('boolean'),
    vendor: DS.attr('string'),
    vendorItemNo: DS.attr('string'),
    distributionUnit: DS.attr('string'),
    quantityGroups: DS.attr(),
    validations: {
        purchaseCost: {
            numericality: true
        },
        originalQuantity: {
            numericality: true
        }
    }
*/        
