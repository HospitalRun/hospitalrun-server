/**
 * https://www.hl7.org/fhir/questionnaire.html
 * No couchdb model
 */

// Not necessary until there is a couch model
module.exports = (srcType, src) => {
  return {
    resourceType    : src.resourceType,
    url             : src.url,
    identifier      : src.identifier || src.id || src.friendlyId,
    version         : src.version,
    name            : src.name,
    title           : src.title,
    status          : src.status,
    experimental    : src.experimental,
    date            : src.date,
    publisher       : src.publisher,
    description     : src.description,
    purpose         : src.purpose,
    approvalDate    : src.approvalDate,
    lastReviewDate  : src.lastReviewDate,
    effectivePeriod : src.effectivePeriod,
    useContext      : src.useContext,
    jurisdiction    : src.jurisdiction,
    contact         : src.contact,
    copyright       : src.copyright,
    code            : src.code,
    subjectType     : src.subjectType,
    item            : src.item
  };
}

