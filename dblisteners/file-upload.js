var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
/**
 * Upload file that is temporarily stored as attachment.
 */
module.exports = function(change, maindb, config) {
  if (change.doc && change.doc.localFile && change.doc.localFile === true && change.doc._attachments) {
    try {
      var currentDoc = change.doc;
      var fileName = '/patientimages' + currentDoc.fileName;
      var filePath = config.imagesdir + currentDoc.fileName;
      // Make the directory to the file if it doesn't exist
      mkdirp(path.dirname(filePath), function(err) {
        if (err) {
          console.log('Error mkdirp for ' + path.dirname(filePath), err);
          return;
        }
        // Get the file from the couchdb attachment
        maindb.attachment.get(currentDoc._id, 'file', function(err, body) {
          if (err) {
            console.log('Error getting file attachment for: ', currentDoc);
            return;
          }
          // Write the file to the filesystem
          fs.writeFile(filePath, body, function(err) {
            if (err) {
              console.log('Error writing file: ' + fileName, err);
              return;
            }
            // Remove the attachment from the document
            maindb.attachment.destroy(currentDoc._id, 'file', currentDoc._rev, function(err, body) {
              if (err) {
                console.log('Error deleting attachment on ' + currentDoc._id + ', rev:' + currentDoc._rev, err);
                return;
              }
              currentDoc._rev = body.rev;
              currentDoc.url = fileName;
              currentDoc.localFile = false;
              delete currentDoc._attachments;
              // Update the url
              maindb.insert(currentDoc, currentDoc._id, function(err) {
                if (err) {
                  console.log('Error updating url for file:' + currentDoc.id, err);
                }
              });
            });
          });
        });
      });
    } catch (ex) {
      console.log('Error handling file-upload: ',ex);
    }
  }
};
