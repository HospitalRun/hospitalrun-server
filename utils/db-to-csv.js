const config =  require('../config.js');
const fs =  require('fs');
const nano = require('nano')(config.couchAuthDbURL);
const relPouch = require('relational-pouch');
const stringify = require('csv-stringify');

const ALLOWED_TYPES = [
  'allergy',
  'appointment',
  'attachment',
  'billingLineItem',
  'customForm',
  'diagnosis',
  'imaging',
  'incCategory',
  'incident',
  'incidentNote',
  'invLocation',
  'invPurchase',
  'invRequest',
  'inventory',
  'invoice',
  'lab',
  'lineItemDetail',
  'lookup',
  'medication',
  'operationReport',
  'operativePlan',
  'option',
  'overridePrice',
  'patient',
  'patientNote',
  'payment',
  'photo',
  'priceProfile',
  'pricing',
  'procCharge',
  'procedure',
  'report',
  'sequence',
  'userRole',
  'visit',
  'vital'
];

const RELATIONSHIPS = {
  allergy:  {
    patient: 'patient',
  },
  appointment: {
    patient: 'patient',
    visits: 'visit'
  },
  billingLineItem: {
    details: 'lineItemDetail'
  },
  imaging: {
    charges: 'procCharge',
    imagingType: 'pricing',
    patient: 'patient',
    visit: 'visit'
  },
  incident: {
    incidentAttachments: 'attachment',
    notes: 'incidentNote',
    patient: 'patient'
  },
  invPurchase: {
    inventoryItem: 'inventory'
  },
  invRequest: {
    inventoryItem: 'inventory',
    patient: 'patient',
    visit: 'visit'
  },
  inventory: {
    locations: 'invLocation',
    purchases: 'invPurchase'
  },
  invoice: {
    lineItems: 'billingLineItem',
    patient: 'patient',
    paymentProfile: 'priceProfile',
    payments: 'payment',
    visit: 'visit'
  },
  lab: {
    charges: 'procCharge',
    labType: 'pricing',
    patient: 'patient',
    visit: 'visit'
  },
  lineItemDetail:  {
    pricingItem: 'pricing'
  },
  medication: {
    inventoryItem: 'inventory',
    patient: 'patient',
    visit: 'visit',
  },
  operationReport: {
    diagnoses: 'diagnosis',
    operativePlan: 'operativePlan',
    patient: 'patient',
    preOpDiagnoses: 'diagnosis'
  },
  operativePlan: {
    diagnoses: 'diagnosis',
    patient: 'patient',
    profile: 'priceProfile'
  },
  patientNote: {
    patient: 'patient',
    visit: 'visit'
  },
  patient: {
    allergies: 'allergy',
    diagnoses: 'diagnosis',
    operationReports: 'operationReport',
    operativePlans: 'operativePlan',
    paymentProfile: 'priceProfile',
    payments: 'payment',
    invoice: 'invoice'
  },
  photo: {
    patient: 'patient'
  },
  pricing: {
    pricingOverrides: 'overridePrice'
  },
  procCharge: {
    medication: 'inventory',
    pricingItem: 'pricing'
  },
  procedure: {
    charges: 'procCharge',
    visit: 'visit'
  },
  report: {
    visit: 'visit'
  },
  visit: {
    charges: 'procCharge',
    diagnoses: 'diagnosis',
    imaging: 'imaging',
    labs: 'lab',
    medication: 'medication',
    patient: 'patient',
    patientNotes: 'patientNote',
    procedures: 'procedure',
    reports: 'report',
    vitals: 'vital'
  }
};

relPouch.setSchema([]);
function mapId(type, id) {
  return relPouch.rel.makeDocID({
    id,
    type
  });
}

let filename;
let dbname = 'main';
let type;

if (process.argv.length < 3) {
  console.log('Usage: node db-dump.js <type> <filename> <dbname>');
  process.exit();
} else {
  type = process.argv[2];
  if (ALLOWED_TYPES.indexOf(type) === -1) {
    if (type !== '--types') {
      console.log(`${type} is not a valid type.`);
    }
    console.log(`Valid types are: ${ALLOWED_TYPES.join(', ')}`);
    process.exit();
  }

  if (process.argv.length > 3) {
    filename = process.argv[3];
  } else {
    filename = type;
  }
  if (filename.indexOf('.') === -1) {
    filename = `${filename}.csv`;
  }
  if (process.argv.length > 4) {
    dbname = process.argv[4];
  }
}

let queryParams = {
  endkey: mapId(type, {}),
  include_docs: true,
  startkey: mapId(type)
};
var maindb = nano.use(dbname);
maindb.list(queryParams, (err, body) => {
  let dumpRows = body.rows.map((row) => {
    let parsedId = relPouch.rel.parseDocID( row.doc._id);
    let relationshipMap = RELATIONSHIPS[parsedId.type];
    if (!relationshipMap) {
      relationshipMap = {};
    }
    let fieldNames = Object.keys(row.doc.data);
    let returnObject = {
      id: row.doc._id
    };
    fieldNames.forEach((fieldName) => {
      returnObject[fieldName] = row.doc.data[fieldName];
      if (relationshipMap[fieldName]) {
        if (Array.isArray(returnObject[fieldName])) {
          returnObject[fieldName] = returnObject[fieldName].map((id) => {
            return mapId(relationshipMap[fieldName], id);
          });
        } else {
          returnObject[fieldName] = mapId(relationshipMap[fieldName], returnObject[fieldName]);
        }
      }
    });
    return returnObject;
  });
  console.log(`Writing ${dumpRows.length} ${type} records to ${filename}`);
  let writer = fs.createWriteStream(filename);
  writer.on('close', () => {
    console.error(`The file ${filename} has been created. Bytes written: ${writer.bytesWritten} `);
    process.exit();
  });
  stringify(dumpRows, {
    header: true,
    quoted: true
  }).pipe(writer);

});
