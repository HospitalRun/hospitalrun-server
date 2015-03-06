/* global emit */
var config =  require('../config.js'),
    fs = require('fs'),
    nano = require('nano')(config.couch_auth_db_url),
    maindb = nano.use('main'),
    moment = require('moment'),
    exportRows = [],
    rowsToExport,
    rowCount = 0,
    exportColumns = [
        'ImpSystem',
        'ImpSystemRef',
        'voucherType',
        'VoucherNo',
        'FiscalYear',
        'PeriodNo',
        'VoucherDate',
        'account',
        'Account Ledger (Asset/BankAccount)',
        'posting1',
        'Posting 2 (PRJ)',
        'XGL',
        'SubledgerNo',
        'SubledgerName',
        'InvoiceDate',
        'InvoiceNo',
        'Xidentifier/KID',
        'DueDate',
        'BankAccount',
        'PaymentTerms',
        'text',
        'TaxRule',
        'Currency',
        'Currency Amount',
        'amount',
        'UpdateSubledger',
        'SubledgerGroup',
        'CompanyNo',
        'StreetAddressL1',
        'StreetAddressL2',
        'ZipCode',
        'Place',
        'State',
        'Country',
        'BillingStreetAddressL1',
        'BillingStreetAddressL2',
        'BillingZipCode',
        'BillingPlace',
        'BillingState',
        'BillingCountry',
        'Phone',
        'Email',
        'YourRef',
        'Dummy1',
        'Dummy2',
        'Dummy3',
        'Dummy4',
        'Dummy5',
        'EOL'
    ],
    voucherDate = moment().format('YYYYMMDD');

setupView(function(err) {
    if (err) {
        console.log("Error setting up view:", err);        
    } else {
        maindb.view('xledger', 'unimported', function(err, body) {
            if (err) {
                console.log("Error getting rows from view:", err);
            } else {
                rowsToExport = body.rows;
                processRow(rowsToExport.shift());
            }
        });
    }    
});

function addExportRow(row) {    
    var exportRow = [];
    exportColumns.forEach(function(column) {
        if (row[column]) {
            exportRow.push(row[column]);
        } else {
            switch (column) {
                case 'VoucherNo': {
                    exportRow.push(1);
                    break;
                }
                case 'VoucherDate': {
                    exportRow.push(voucherDate);
                    break;
                }
                case 'XGL': {
                    exportRow.push('Philippines');
                    break;
                }
                case 'EOL': {
                    exportRow.push('x');
                    break;
                }
                default: {
                    exportRow.push('');
                }
            }
            
        }
    });
    exportRows.push(exportRow);
}

function finishProcessRow(err, doc) {
    if (err) {
        console.log("Error processing row: ", err, doc);
        processRow(rowsToExport.shift());
    } else {
        processRow(rowsToExport.shift());
        /*doc.exportedToXledger = true;
        maindb.insert(doc, function(err) {
            if (err) {
                console.log("error marking row as exported to xledger: ",err, doc);
            }
            processRow(rowsToExport.shift());        
        });*/
    }    
}

function getExpenseAccountCode(expenseAccount) {
    var numberPattern = /\d+/g, //Regex to find numbers
        matches = expenseAccount.match(numberPattern);
    if (matches.length > 0) {
        return matches[0];
    }
}

function getExpenseAccountText(expenseAccount) {
    var textPattern = /\D+/g, //Regex to find text
        matches = expenseAccount.replace('-','').match(textPattern);
    if (matches.length > 0) {
        return matches[0].trim();
    }
}

function processInvoice(invoice, id, callback) {
    maindb.fetch(invoice.lineItems, function(err, lineItems) {
        if (err) {
            callback(err);
        }
    });
}

function processInventoryPurchase(inventoryPurchase, id, callback) {
    callback(null, inventoryPurchase);
}
function processInventoryRequest(inventoryRequest, id, callback) {
    callback(null, inventoryRequest);
}
function processPayment(payment, id, callback) {
    var accountToDebit,
        expenseAccountText = getExpenseAccountText(payment.expenseAccount),
        url = config.server_url+'/#/payment/edit/'+id;
    addExportRow({
        voucherType: 'SO',
        account: '1170',
        posting1: '101',
        text: 'Cash paid for deposit '+url,
        amount: payment.amount
    });
    if (payment.charityPatient) {
        accountToDebit = '4180';
    } else {
        accountToDebit = '4160';
    }    
    addExportRow({
        voucherType: 'SO',
        account: accountToDebit,
        posting1: getExpenseAccountCode(payment.expenseAccount),
        text: expenseAccountText+' '+url,
        amount: '-'+payment.amount
    });
    callback(null, payment);
}

function processRow(row) {
    if (row) {
        var doc = row.value,
            uidx = doc._id.indexOf("_"),
            id = doc._id.substring(uidx+1),
            doctype = doc._id.substring(0, uidx);                                      
        rowCount++;
        switch(doctype) {
            case 'invoice': {
                processInvoice(doc, id, finishProcessRow);
                break;
            }
            case 'payment': {
                processPayment(doc, id, finishProcessRow);
                break;
            }
            case 'inv-purchase':  {
                processInventoryPurchase(doc, id, finishProcessRow);
                break;
            }
            case 'inv-request': {
                processInventoryRequest(doc, id, finishProcessRow);
                break;
            } 
        }
    } else {        
        console.log(moment().format() +' Done.  '+rowCount+' rows processed');
        var csvRows = [],
            csvString;
        csvRows.push(exportColumns.join(';'));
        exportRows.forEach(function(row) { 
            csvRows.push(row.join(';'));
        });
        csvString = csvRows.join('\r\n');
        var now = new Date();
        fs.writeFile(config.xledger_dir+'/'+now.getTime()+'.csv', csvString, function (err) {
            if (err) {
                console.log('Error writing csv file:'+err);
            } else {
                console.log('Done writing file');
            }
        });
    }
}

function setupView(callback) {
    maindb.get('_design/xledger', function(err, body) {
        if (!err) {
            callback(null, body);
        } else {        
            var ddoc = {
                views: {
                    unimported: {
                        map: function(doc) {
                            var doctype,  
                                uidx;
                            if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
                                doctype = doc._id.substring(0, uidx);
                                switch(doctype) {
                                    case 'invoice':
                                    case 'payment':
                                    case 'inv-purchase': 
                                    case 'inv-request': {
                                        if(!doc.exportedToXledger) { 
                                            emit(null, doc); 
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            maindb.insert(ddoc, '_design/xledger', callback);
        }
    });
}
