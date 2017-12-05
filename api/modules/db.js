const config        = require('../../config.js');
const log           = require('../config.js').log;
const nano          = require('nano')(config.couchAuthDbURL);
const maindb        = nano.use('main');
const relPouch      = require('relational-pouch');
const uuid          = require('node-uuid');
const RELATIONSHIPS = require('./relationships.js');

relPouch.setSchema([]);

// Create a db _id from uuid and camelized type
const generateId = type => relPouch.rel.makeDocID({
  id   : uuid.v4(),
  type : type.replace(/_(\w)/, m => m[1].toUpperCase())
});

const mapId = (type, id) => {
  return relPouch.rel.makeDocID({ id, type });
}

const mapRelationships = data => {
  return data.map(row => {
    const parsedId = relPouch.rel.parseDocID(row.doc._id);
    const relationshipMap = RELATIONSHIPS[parsedId.type];
    const fieldNames = Object.keys(row.doc.data);
    const returnObject = { id: row.doc._id };

    fieldNames.forEach(fieldName => {
      returnObject[fieldName] = row.doc.data[fieldName];
      if (relationshipMap[fieldName]) {
        if (Array.isArray(returnObject[fieldName])) {
          returnObject[fieldName] = returnObject[fieldName].map(id => {
            return mapId(relationshipMap[fieldName], id);
          });
        } else {
          returnObject[fieldName] = mapId(relationshipMap[fieldName], returnObject[fieldName]);
        }
      }
    });
    return returnObject;
  });
}

exports.index = type => {
  return new Promise((resolve, reject) => {
    if (typeof type != 'string') return reject('Model type must be a string');

    const queryParams = {
      startkey     : mapId(type),
      endkey       : mapId(type, {}),
      include_docs : true
    };

    maindb.list(queryParams, (error, body) => {
      if (error) return reject(error);
      return resolve(mapRelationships(body.rows));
    });
  });
}

exports.show = (id, designName, viewName) => {
  return new Promise((resolve, reject) => {
    const parsed = relPouch.rel.parseDocID(id);
    // If it's a db _id, do a get
    if (parsed.type) {
      maindb.get(id, (error, body) => {
        if (error) return reject(error);
        body.data.id = body._id;
        return resolve(body.data);
      });
    // Otherwise do a key search
    } else if (!designName || !viewName) {
      maindb.view(designName, viewName, {
        startkey : [ id ],
        endkey   : [ id, {} ]
      }, (error, body) => {
        if (error || body.rows.length !== 1) return reject(error);
        maindb.get(body.rows[0].id, (error, body) => {
          if (error) return reject(error);
          body.data.id = body._id;
          return resolve(body.data);
        });
      });
    } else {
      // TODO - handle custom id's
      return reject({ error: 'Invalid request' });
    }
  });
}

exports.create = (documentName, data, id = generateId(documentName)) => {
  return new Promise((resolve, reject) => {
    maindb.insert({ _id: id, data: data }, (error, body) => {
      if (error) return reject(error);
      maindb.get(id, (error, body) => {
        if (error) return reject(error);
        body.data.id = body._id;
        return resolve(body.data);
      });
    });
  });
}

exports.update = (id, data) => {
  return new Promise((resolve, reject) => {
    // First need to get the document revision
    maindb.get(id, (error, body) => {
      if (error) return reject(error);
      // Then make the change
      maindb.insert({ _id: id, _rev: body._rev, data: data }, (error, body) => {
        if (error) return reject(error);
        // Then hit the db again since it doesn't give us all the data
        maindb.get(id, (error, body) => {
          if (error) return reject(error);
          body.data.id = body._id;
          return resolve(body.data);
        });
      });
    })
  });
}

exports.audit = (id, data) => {
  log('DB::fhiraudit', { id, data });

  return new Promise((resolve, reject) => {
    // Get the most recent revision
    maindb.get('fhir_audit', (error, auditDoc) => {
      if (error) {
        log('DB::fhiraudit:index error:', { id, data, error, auditDoc });
        console.error('Error: something went wrong updating the audit doc. Check the logs for more info');
        return reject(error);
      } else {
        const attName     = `${auditDoc._rev}.${id}`,
              contentType = 'application/json',
              docname     = 'fhir_audit',
              query       = { rev: auditDoc._rev },
              audit       = JSON.stringify(data);

        maindb.attachment.insert(docname, attName, audit, contentType, query, (error, body) => {
          if (error) {
            log('DB::fhiraudit:update error:', { id, data, error, docName, attName, contentType, query, auditDoc });
            console.error('Error: something went wrong updating the audit doc. Check the logs for more info');
            return reject(error);
          } else {
            return resolve(body);
          }
        });
      }
    });
  });
}
