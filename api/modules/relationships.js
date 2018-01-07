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
  questionnaire: {},
  questionnaireResponse: {
    questionnaire: 'questionnaire',
    subject: 'patient'
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

module.exports = RELATIONSHIPS;
