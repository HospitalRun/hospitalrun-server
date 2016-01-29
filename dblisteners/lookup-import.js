var parse = require('csv-parse');
/**
 * Removes file attachment from document and then updates the document
 */
function updateDocument(maindb, docToUpdate) {
  maindb.attachment.destroy(docToUpdate._id, 'file', docToUpdate._rev, function(err, body) {
    if (err) {
      console.log('Error deleting attachment on ' + docToUpdate._id + ', rev:' + docToUpdate._rev, err);
      return;
    }
    docToUpdate._rev = body.rev;
    docToUpdate.importFile = false;
    delete docToUpdate._attachments;
    // Update the document
    maindb.insert(docToUpdate, docToUpdate._id, function(err) {
      if (err) {
        console.log('Error marking import as complete:' + docToUpdate.id, err);
      }
    });
  });
}
/**
 * Upload file that is temporarily stored as attachment.
 */
module.exports = function(change, maindb) {
  if (change.doc && change.doc._id.indexOf('lookup_') === 0 && change.doc.importFile === true && change.doc._attachments) {
    try {
      var currentDoc = change.doc;
      var parser = parse({columns: true, trim: true, delimiter: ';'}, function(err, data) {
        if (err) {
          console.log('Error parsing csv file:', err);
        } else {
          var codeMap = {};
          var haveCodeMapValues = false;
          data.forEach(function(row) {
            if (row.Description && row.Description !== '') {
              if (currentDoc.value.indexOf(row.Description) === -1) {
                currentDoc.value.push(row.Description);
              }
              if (row.Code && row.Code !== '') {
                codeMap[row.Description] = row.Code;
                haveCodeMapValues = true;
              }
            }
          });
          currentDoc.value.sort();
          if (haveCodeMapValues) {
            currentDoc.codeMap = codeMap;
          }
        }
        updateDocument(maindb, currentDoc);
      });
      // Get the file from the couchdb attachment
      maindb.attachment.get(currentDoc._id, 'file').pipe(parser);
    } catch (ex) {
      console.log('Error handling lookup-import: ',ex);
    }
  }
};
