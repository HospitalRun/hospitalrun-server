/**
 * Merge conflicts by using the modifiedFields to determine who modified what last.
 * Performs a field level merge by comparing modifiedField timestamps (latest wins).
 */
module.exports = function(change, maindb) {
  if (change.doc && change.doc._conflicts) {
    var conflicts = change.doc._conflicts;

    maindb.get(change.id, {open_revs: JSON.stringify(conflicts)}, function(err, body) {
      var compareObj;
      var currentDoc = change.doc;
      var currentModifiedDate;
      var i;
      var key;
      var modifiedDate;
      var updateDocument = false;
      var updateProperty;
      if (!currentDoc.modifiedFields) {
        currentDoc.modifiedFields = {};
      }
      if (err) {
        console.log('ERROR GETTING CONFLICTING REVS: ',err);
      } else if (body.length) {
        for (i = 0;i < body.length;i++) {
          compareObj = body[i].ok;
          if (compareObj.modifiedFields) {
            for (key in compareObj.modifiedFields) {
              updateProperty = false;
              modifiedDate = new Date(compareObj.modifiedFields[key]);
              if (currentDoc.modifiedFields[key]) {
                currentModifiedDate = new Date(currentDoc.modifiedFields[key]);
                if (modifiedDate.getTime() > currentModifiedDate.getTime()) {
                  updateProperty = true;
                }
              } else {
                updateProperty = true;
              }
              if (updateProperty) {
                updateDocument = true;
                currentDoc.modifiedFields[key] = modifiedDate;
                currentDoc[key] = compareObj[key];
              }
            }
          }
        }
        if (updateDocument) {
          delete currentDoc._conflicts;
          maindb.insert(currentDoc, currentDoc._id, function(err, response) {
            if (!err && !response.ok) {
              for (i = 0;i < conflicts.length;i++) {
                maindb.destroy(currentDoc._id,  conflicts[i]);
              }
            }
          });
        }
      }
    });
  }
};
