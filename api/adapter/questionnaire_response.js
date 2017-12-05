/**
 * https://www.hl7.org/fhir/questionnaireResponse.html
 * No couchdb model
 */

// Not necessary until there is a couch model
module.exports = (srcType, src) => {
  return {
    resourceType  : src.resourceType,
    identifier    : src.identifier || src.id || src.friendlyId,
    basedOn       : src.basedOn,
    parent        : src.parent,
    questionnaire : src.questionnaire,
    status        : src.status,
    subject       : src.subject,
    context       : src.context,
    authored      : src.authored,
    author        : src.author,
    source        : src.source,
    item          : src.item
  };
}
