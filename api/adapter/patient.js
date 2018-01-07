/**
 * https://www.hl7.org/fhir/patient.html
 * https://github.com/HospitalRun/hospitalrun-frontend/blob/master/app/models/patient.js
 */

module.exports = (srcType, src) => {
  if (srcType.toLowerCase() === 'fhir' ) {
    // convert FHIR to HRcouch
    let mapping = {
      address            : src.address,
      additionalContacts : src.contact,
      admitted           : false,
      checkedIn          : false,
      dateOfBirth        : src.birthDate,
      externalPatientId  : src.identifier,
      firstName          : src.name && src.name[0].given && src.name[0].given.join(' '),  // may include middle name(s)
      lastName           : src.name && src.name[0].family && src.name[0].family.join(' '),
      phone              : src.telecom,
      sex                : src.gender
    };

    if (Array.isArray(src.address)) {
      const convertAddress = a => {
        if (a) {
          return `${a.line && a.line.join(' ')}, ${a.city}, ${a.state}, ${a.country}, ${a.postalCode}`;
        }
      }
      mapping.address  = convertAddress(src.address[0]);
      mapping.address2 = convertAddress(src.address[1]);
      mapping.address3 = convertAddress(src.address[2]);
      mapping.address4 = convertAddress(src.address[3]);
    }

    if (Array.isArray(src.telecom)) {
      let phones = [];
      let emails = [];
      src.telecom.forEach(contactPoint => {
        if (contactPoint.system === 'phone') {
          phones.push(contactPoint.value);
        } else if (contactPoint.system === 'email') {
          emails.push(contactPoint.value);
        }
      });
      if (emails.length) mapping.email = emails.join(', ');
      if (phones.length) mapping.phone = phones.join(', ');
    }

    return mapping;

  } else if (srcType.toLowerCase() === 'couch') {
    // convert HRcouch to FHIR
    const convertAddress = a => {
      if (!a) return null;

      // If we don't have all the parts, there is no easy way to tell which is which
      const split = a.split(/,[ ]*/);
      if (split.length < 5) return { line: a };

      // If it went into the DB from this adaptor, this order will be preserved
      const [line, city, state, country, postalCode] = split;
      return { line, city, state, country, postalCode };
    }

    const convertTelecom = (phones, emails) => {
      let telecoms = [];
      if (phones) {
        phones.split(/,[ ]*/).forEach(p => telecoms.push({ system: 'phone', value: p }));
      }
      if (emails) {
        emails.split(/,[ ]*/).forEach(p => telecoms.push({ system: 'email', value: p }));
      }
      return telecoms;
    }

    return {
      resourceType : 'Patient',
      identifier   : src.friendlyId || src.id || src.externalPatientId,
      name         : { given: [ src.firstName, src.middleName ].join(' '), family: src.lastName },
      telecom      : convertTelecom(src.phone, src.email),
      gender       : src.sex,
      birthDate    : src.dateOfBirth,
      address      : [src.address, src.address2, src.address3, src.address4].map(a => convertAddress(a)).filter(a => a),
      contact      : src.additionalContacts
    }
  }

  return null;
}
