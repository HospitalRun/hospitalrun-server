var config =  require('../config.js');
var colors = require('colors/safe');
var nano = require('nano')(config.couchAuthDbURL);
var maindb = nano.use('main');
var prompt = require("prompt");
var recordsToDelete = [];

prompt.start();
prompt.message = colors.red("WARNING!!!!");
prompt.get({
  properties: {
    confirm: {
      description: colors.red('This script will delete ALL entries in your database.  If you wish to continue, please type in CONTINUE')
    }
  }
}, function (err, result) {
    if (err) {
      console.log('Error getting prompt:',err);
    } else if (result.confirm === 'CONTINUE') {
      prompt.stop();
      console.log('Getting list of records to delete');
      maindb.list(function(err, results) {
        if (!err) {
          results.rows.forEach(function(result) {
            var recordToDelete = {
              '_id': result.id,
              '_rev': result.value.rev,
              '_deleted': true
            };
            recordsToDelete.push(recordToDelete);
          });
          if (recordsToDelete.length > 0) {
            console.log('About to delete ' + recordsToDelete.length + ' records.');
            maindb.bulk({ docs: recordsToDelete}, function(err, results) {
              if (err) {
                console.log('Error deleting records.', JSON.stringify(err, null, 2));
              } else {
                var okResults = 0;
                results.forEach(function(result) {
                  if (result.ok === true) {
                    okResults++;
                  }
                });
                console.log('Success deleting records. Number of records deleted: ' + okResults+ '.');
              }
              process.exit(1);
            });
          } else {
            console.log('There are no records to delete.');
            process.exit(1);
          }
        } else {
          console.log('ERROR fetching records', err);
          process.exit(1);
        }
      });
    } else {
      console.log('skipping');
      process.exit(1);
    }
  });

