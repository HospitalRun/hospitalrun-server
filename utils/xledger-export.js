/* global emit */
var config =  require('../config.js'),
    fs = require('fs'),
    nano = require('nano')(config.couch_auth_db_url),
    mandrill = require('mandrill-api/mandrill'),
    mandrill_client = new mandrill.Mandrill(config.mandrill_api_key),
    maindb = nano.use('main'),
    moment = require('moment'),
    accounts = {
      accountsPayable: '2100',
      accountsReceivable: '1210',
      inventory: '1410',
      cashInSafe: '1170',
      gikContributions: '4505',
      patientRevenueCharitable: '4180',
      patientRevenuePrivate: '4160',
      inventoryConsumed: '5140',
      gikUsage: '5160',
      inventoryObsolescence: '5180'

    },

    costCenters = {
      admin: '101',
    },
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
    missingVendors = {},
    vendorCodeMap = {},
    voucherDate = moment().format('YYYYMMDD'),
    voucherNumber = 1,
    voucherMap = [];

setupView(function(err) {
  if (err) {
    console.log('Error setting up view:', err);
  } else {
    getVendorList(function(err) {
      if (err) {
        console.log('Error getting vendor list:', err);
      } else {
        maindb.view('xledger', 'unimported', function(err, body) {
          if (err) {
            console.log('Error getting rows from view:', err);
          } else {
            rowsToExport = body.rows;
            processRow(rowsToExport.shift());
          }
        });
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

function formatDate(dateString) {
  var date = new Date(dateString);
  return moment(date).format('YYYYMMDD');
}

function findSubledgerNo(inventoryPurchase) {
  var vendor = inventoryPurchase.vendor;
  if (isEmpty(vendor)) {
    return;
  }
  if (vendorCodeMap[vendor]) {
    console.log('FOUND VENDOR: ' + vendor);
    return vendorCodeMap[vendor];
  } else if (vendorCodeMap[vendor.toUpperCase()]) {
    console.log('FOUND UPPER VENDOR: ' + vendor + '; returning:',vendorCodeMap[vendor.toUpperCase()]);
    return vendorCodeMap[vendor.toUpperCase()];
  } else {
    if (!missingVendors[vendor]) {
      missingVendors[vendor] = [inventoryPurchase._id];
    } else {
      missingVendors[vendor].push(inventoryPurchase._id);
    }
    return;
  }
}

function findInventoryPurchase(purchases, id) {
  var matchingItems = purchases.filter(function(purchase) {
    if (purchase.id === id) {
      return true;
    }
  });
  if (matchingItems.length > 0) {
    return matchingItems[0];
  }
}

function findVoucherNumber(purchase) {
  if (isEmpty(purchase.invoiceNo)) {
    return voucherNumber++;
  } else {
    var matchingVoucher = voucherMap.filter(function(voucherItem) {
      return (voucherItem.vendor === purchase.vendor && voucherItem.invoiceNo === purchase.invoiceNo);
    });
    if (matchingVoucher.length > 0) {
      return matchingVoucher[0].voucherNumber;
    } else {
      var voucher = {
        invoiceNo: purchase.invoiceNo,
        vendor: purchase.vendor,
        voucherNumber: voucherNumber++
      };
      voucherMap.push(voucher);
      return voucher.voucherNumber;
    }
  }
}

function finishProcessRow(err, doc) {
  if (err) {
    if (err.error !== 'not_found') {
      console.log('Error processing row doc was: ', doc);
      console.log('Error processing row error reason and error were ', err.reason, err.error, err);
    }
    processRow(rowsToExport.shift());
  } else {

    if (doc.updateRecord) {
      maindb.insert(doc, function(err) {
        if (err) {
          console.log('error updateRecord: ',err, doc);
        }
        processRow(rowsToExport.shift());
      });
    } else {
      processRow(rowsToExport.shift());
    }
    if (!doc.skipRecord) {
      /*Doc.exportedToXledger = true;
      maindb.insert(doc, function(err) {
          if (err) {
              console.log("error marking row as exported to xledger: ",err, doc);
          }
          processRow(rowsToExport.shift());
      });*/
    }
  }
}

function getExpenseAccountCode(expenseAccount) {
  if (expenseAccount) {
    var numberPattern = /\d+/g, //Regex to find numbers
        matches = expenseAccount.match(numberPattern);
    if (matches && matches.length > 0) {
      return matches[0];
    }
  }
}

function getExpenseAccountText(expenseAccount) {
  var textPattern = /\D+/g, //Regex to find text
      matches = expenseAccount.replace('-','').match(textPattern);
  if (matches.length > 0) {
    return matches[0].trim();
  }
}

function getInventoryDetails(inventoryId, callback) {
  maindb.get(inventoryId, function(err, inventoryItem) {
    if (err) {
      callback(err, inventoryId);
    } else {
      var url = config.serverURL + '/#/inventory/edit/' + inventoryId.substr(10);
      if (inventoryItem.name.replace) {
        inventoryItem.name = inventoryItem.name.replace(';',' ').replace(/[\W]+/g,' ');
      }
      callback(null, inventoryItem.name + ' : ' + url, url);
    }
  });
}

function getPurchaseCostPerUnit(purchase) {
  var purchaseCost = purchase.purchaseCost,
      quantity = parseInt(purchase.originalQuantity);
  if (!purchaseCost || !quantity || purchaseCost === 0 || quantity === 0) {
    return 0;
  }
  return Number((purchaseCost / quantity).toFixed(2));
}

function getVendorList(callback) {
  maindb.get('lookup_vendor_list', function(err, body) {
    if (err) {
      callback(err);
    } else {
      if (body.codeMap) {
        vendorCodeMap = body.codeMap;
        console.log('vendorCodeMap: ',vendorCodeMap);
        callback(null);
      } else {
        callback('Vendor List did not have codemap.');
      }
    }
  });
}

function isEmpty(value) {
  return (!value || value === '');
}

function processInvoice(invoice, id, callback) {
  var fetchParams = {
    keys: invoice.lineItems
  };
  maindb.fetch(fetchParams, function(err, lineItems) {
    if (err) {
      callback(err, invoice);
    } else {
      lineItems.rows.forEach(function(row) {
            });
      callback(null, invoice);
    }
  });
}

function processInventoryPurchase(inventoryPurchase, id, callback) {
  if (isEmpty(inventoryPurchase.purchaseCost) || inventoryPurchase.purchaseCost === 0) {
    callback(null, inventoryPurchase);
    return;
  }
  getInventoryDetails(inventoryPurchase.inventoryItem, function(err, inventoryDetails, url) {
    if (err) {
      callback(err, inventoryPurchase);
    } else {
      var currentVoucherNo,
          exportRow,
          subledgerNo = findSubledgerNo(inventoryPurchase);
      if (!inventoryPurchase.giftInKind && isEmpty(subledgerNo)) {
        callback(null, inventoryPurchase);
        return;
      }
      currentVoucherNo = findVoucherNumber(inventoryPurchase);
      addExportRow({
        VoucherDate: formatDate(inventoryPurchase.dateReceived),
        voucherType: 'LG',
        account: accounts.inventory,
        posting1: costCenters.admin,
        text: inventoryDetails,
        amount: inventoryPurchase.purchaseCost,
        VoucherNo: currentVoucherNo
      });
      exportRow = {
        voucherType: 'LG',
        posting1: costCenters.admin,
        amount: '-' + inventoryPurchase.purchaseCost,
        VoucherDate: formatDate(inventoryPurchase.dateReceived),
        VoucherNo: currentVoucherNo
      };
      if (inventoryPurchase.giftInKind) {
        exportRow.account = accounts.gikContributions;
        exportRow.text = 'GIK contributed to the hospital: ' + url;
      } else {
        exportRow.SubledgerNo = subledgerNo;
        exportRow.account = accounts.accountsPayable;
        exportRow.text = 'A/P to ' + inventoryPurchase.vendor + ' : ' + url;
      }
      addExportRow(exportRow);
      callback(null, inventoryPurchase);
    }
  });
}
function processInventoryRequest(inventoryRequest, id, callback) {
  if (inventoryRequest.status !== 'Completed' || inventoryRequest.transactionType === 'Transfer') {
    inventoryRequest.skipRecord = true;
    callback(null, inventoryRequest);
  } else {
    if (isEmpty(inventoryRequest.expenseAccount)) {
      callback(null, inventoryRequest);
      return;
    }
    if (isEmpty(getExpenseAccountCode(inventoryRequest.expenseAccount))) {
      switch (inventoryRequest.expenseAccount) {
        case 'Supplies & Materials - Admin': {
          inventoryRequest.expenseAccount = 'Admin Operations - 101';
          inventoryRequest.updateRecord = true;
          break;
        }
        case 'Supplies & Materials - Housekeeping': {
          inventoryRequest.expenseAccount = 'Housekeeping - 110';
          inventoryRequest.updateRecord = true;
          break;
        }
        case 'Supplies & Materials - Kitchen': {
          inventoryRequest.expenseAccount = 'Kitchen - 111';
          inventoryRequest.updateRecord = true;
          break;
        }
        case 'Supplies & Materials - Lab': {
          inventoryRequest.expenseAccount = 'Lab - 112';
          inventoryRequest.updateRecord = true;
          break;
        }
        case 'Supplies & Materials - Mainten': {
          inventoryRequest.expenseAccount = 'Maintenance - 114';
          inventoryRequest.updateRecord = true;
          break;
        }
        case 'Supplies & Materials - Nursing': {
          inventoryRequest.expenseAccount = 'Nursing - 117';
          inventoryRequest.updateRecord = true;
          break;
        }
        case 'Supplies & Materials - OR': {
          inventoryRequest.expenseAccount = 'OR - 119';
          inventoryRequest.updateRecord = true;
          break;
        }
        case 'Supplies & Materials - Pharmacy': {
          inventoryRequest.expenseAccount = 'Pharmacy - 123';
          inventoryRequest.updateRecord = true;
          break;
        }
        case 'Supplies & Materials - Therapy': {
          inventoryRequest.expenseAccount = 'Therapy - 129';
          inventoryRequest.updateRecord = true;
          break;
        }
        default: {
          console.log('DON\'T HAVE calculated expense ACCOUNT: ',inventoryRequest._id, inventoryRequest.expenseAccount);
          callback(null, inventoryRequest);
          return;
        }
      }
    }
    getInventoryDetails(inventoryRequest.inventoryItem, function(err, inventoryDetails) {
      if (err) {
        callback(err, inventoryRequest);
      } else {
        var purchaseIds = inventoryRequest.purchasesAffected.map(function(purchase) {
          return 'inv-purchase_' + purchase.id;
        });
        var fetchvars = {
          keys: purchaseIds
        };
        maindb.fetch(fetchvars, function(err, fetchResult) {
          var currentVoucherNo = voucherNumber++,
              deductFromInventory;
          if (err) {
            callback(err, inventoryRequest);
          } else {
            var completedDate = formatDate(inventoryRequest.dateCompleted),
                accountToUse,
                purchases = fetchResult.rows;
            switch (inventoryRequest.transactionType) {
              case 'Adjustment (Remove)':
              case 'Write Off': {
                accountToUse = accounts.inventoryObsolescence;
                deductFromInventory = true;
                break;
              }
              case 'Fulfillment': {
                deductFromInventory = true;
                accountToUse = accounts.inventoryConsumed; //(5160 -if gift in kind)
                break;
              }
              case 'Return To Vendor': {
                accountToUse = accounts.accountsReceivable;
                deductFromInventory = true;
                break;
              }
              case 'Adjustment (Add)':
              case 'Return': {
                accountToUse = accounts.inventoryConsumed; //(5160 -if gift in kind)
                deductFromInventory = false;
                break;
              }
            }
            var total = 0;
            purchases.forEach(function(purchase) {
              var costPerUnit = getPurchaseCostPerUnit(purchase.doc),
                  purchaseAffected = findInventoryPurchase(inventoryRequest.purchasesAffected, purchase.doc._id.substr(13)),
                  transactionAmount =  Number(purchaseAffected.quantity * costPerUnit).toFixed(2),
                                exportRow = {
                                  VoucherDate: completedDate,
                                  voucherType: 'LG',
                                  account: accounts.inventoryConsumed,
                                  posting1: getExpenseAccountCode(inventoryRequest.expenseAccount),
                                  text: inventoryDetails,
                                  amount: transactionAmount,
                                  VoucherNo: currentVoucherNo
                                };
              total += Number(transactionAmount);
              if (deductFromInventory) {
                exportRow.amount = transactionAmount;
              } else {
                exportRow.amount = '-' + transactionAmount;
              }
              if (purchase.doc.giftInKind && accountToUse === accounts.inventoryConsumed) {
                exportRow.account = accounts.gikUsage;
              } else {
                exportRow.account = accountToUse;
              }
              addExportRow(exportRow);
            });
            var exportRow = {
              VoucherDate: completedDate,
              voucherType: 'LG',
              account: accounts.inventory,
              posting1: costCenters.admin,
              text: inventoryDetails,
              VoucherNo: currentVoucherNo
            };
            total = Number(total).toFixed(2);
            if (deductFromInventory) {
              exportRow.amount = '-' + total;
            } else {
              exportRow.amount = total;
            }
            addExportRow(exportRow);
          }
        });
        callback(null, inventoryRequest);
      }
    });
  }
}

function processPayment(payment, id, callback) {
  var accountToDebit,
      expenseAccountText = getExpenseAccountText(payment.expenseAccount),
      url = config.serverURL + '/#/payment/edit/' + id;
  addExportRow({
    voucherType: 'SO',
    account: accounts.cashInSafe,
    posting1: costCenters.admin,
    text: 'Cash paid for deposit ' + url,
    amount: payment.amount
  });
  if (payment.charityPatient) {
    accountToDebit = accounts.patientRevenueCharitable;
  } else {
    accountToDebit = accounts.patientRevenuePrivate;
  }
  addExportRow({
    voucherType: 'SO',
    account: accountToDebit,
    posting1: getExpenseAccountCode(payment.expenseAccount),
    text: expenseAccountText + ' ' + url,
    amount: '-' + payment.amount
  });
  callback(null, payment);
}

function processRow(row) {
  if (row) {
    var doc = row.value,
        uidx = doc._id.indexOf('_'),
        id = doc._id.substring(uidx + 1),
        doctype = doc._id.substring(0, uidx);
    rowCount++;
    switch (doctype) {
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
    console.log(moment().format() + ' Done.  ' + rowCount + ' rows processed');
    var csvRows = [],
        csvString;
    csvRows.push(exportColumns.join(';'));
    exportRows.forEach(function(row) {
      csvRows.push(row.join(';'));
    });
    csvString = csvRows.join('\r\n');
    var now = new Date();
    var emailText = 'XLedger Export ' + moment(now).format('l');
    var message = {
      html: emailText,
      text: emailText,
      subject: emailText,
      from_email: 'notifications@hospitalrun.io',
      from_name: 'HospitalRun Notifications',
      to: [{
        email: config.xledger_notification_email,
      }],
      attachments: [{
        type: 'text/csv',
        name: now.getTime() + '.csv',
        content: new Buffer(csvString).toString('base64')
      }]
    };

    mandrill_client.messages.send({message: message }, function() {
      console.log('Sucessfully sent email.');
    }, function(e) {
      // Mandrill returns the error as an object with name and message keys
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message, e);
    });

    console.log('Missing vendors are: ',missingVendors);
    for (var vendor in missingVendors) {
      console.log(vendor);
    }

    fs.writeFile(config.xledger_dir + '/' + now.getTime() + '.csv', csvString, function(err) {
      if (err) {
        console.log('Error writing csv file:' + err);
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
              if (doc._id && (uidx = doc._id.indexOf('_')) > 0) {
                doctype = doc._id.substring(0, uidx);
                switch (doctype) {
                  case 'invoice':
                  case 'payment':
                  case 'inv-purchase':
                  case 'inv-request': {
                    if (!doc.exportedToXledger) {
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
