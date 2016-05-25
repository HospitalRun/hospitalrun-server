var config =  require('../config.js');
var nano = require('nano')(config.couchAuthDbURL);
var maindb = nano.use('main');
var recordsToUpdate = [];

var paragraphs = [
  'You don\'t believe in the Force, do you? She must have hidden the plans in the escape pod. Send a detachment down to retrieve them, and see to it personally, Commander. There\'ll be no one to stop us this time!',
  'Hokey religions and ancient weapons are no match for a good blaster at your side, kid. I call it luck. Look, I ain\'t in this for your revolution, and I\'m not in it for you, Princess. I expect to be well paid. I\'m in it for the money.',
  'What good is a reward if you ain\'t around to use it? Besides, attacking that battle station ain\'t my idea of courage. It\'s more like…suicide. Your eyes can deceive you. Don\'t trust them. The Force is strong with this one. I have you now.',
  'All right. Well, take care of yourself, Han. I guess that\'s what you\'re best at, ain\'t it? No! Alderaan is peaceful. We have no weapons. You can\'t possibly… In my experience, there is no such thing as luck.',
  'I need your help, Luke. She needs your help. I\'m getting too old for this sort of thing. I need your help, Luke. She needs your help. I\'m getting too old for this sort of thing. In my experience, there is no such thing as luck.',
  'Red Five standing by. Don\'t underestimate the Force. I find your lack of faith disturbing. Don\'t be too proud of this technological terror you\'ve constructed. The ability to destroy a planet is insignificant next to the power of the Force.',
  'A tremor in the Force. The last time I felt it was in the presence of my old master. Kid, I\'ve flown from one side of this galaxy to the other. I\'ve seen a lot of strange stuff, but I\'ve never seen anything to make me believe there\'s one all-powerful Force controlling everything. There\'s no mystical energy field that controls my destiny. It\'s all a lot of simple tricks and nonsense.',
  'She must have hidden the plans in the escape pod. Send a detachment down to retrieve them, and see to it personally, Commander. There\'ll be no one to stop us this time! No! Alderaan is peaceful. We have no weapons. You can\'t possibly…',
  'I suggest you try it again, Luke. This time, let go your conscious self and act on instinct. I need your help, Luke. She needs your help. I\'m getting too old for this sort of thing. I call it luck. I\'m trying not to, kid.',
  'Still, she\'s got a lot of spirit. I don\'t know, what do you think? Leave that to me. Send a distress signal, and inform the Senate that all on board were killed. Escape is not his plan. I must face him, alone.',
  'No! Alderaan is peaceful. We have no weapons. You can\'t possibly… You are a part of the Rebel Alliance and a traitor! Take her away! Still, she\'s got a lot of spirit. I don\'t know, what do you think?',
  'Still, she\'s got a lot of spirit. I don\'t know, what do you think? Hokey religions and ancient weapons are no match for a good blaster at your side, kid. Remember, a Jedi can feel the Force flowing through him.',
  'A tremor in the Force. The last time I felt it was in the presence of my old master. I\'m surprised you had the courage to take the responsibility yourself. Escape is not his plan. I must face him, alone.',
  'What?! The Force is strong with this one. I have you now. You don\'t believe in the Force, do you? He is here.',
  'What!? Hokey religions and ancient weapons are no match for a good blaster at your side, kid. Escape is not his plan. I must face him, alone. In my experience, there is no such thing as luck.',
  'But with the blast shield down, I can\'t even see! How am I supposed to fight? In my experience, there is no such thing as luck. What!? A tremor in the Force. The last time I felt it was in the presence of my old master.',
  'I need your help, Luke. She needs your help. I\'m getting too old for this sort of thing. Leave that to me. Send a distress signal, and inform the Senate that all on board were killed. You mean it controls your actions?',
  'Don\'t be too proud of this technological terror you\'ve constructed. The ability to destroy a planet is insignificant next to the power of the Force. Escape is not his plan. I must face him, alone. Still, she\'s got a lot of spirit. I don\'t know, what do you think?',
  'I call it luck. I call it luck. She must have hidden the plans in the escape pod. Send a detachment down to retrieve them, and see to it personally, Commander. There\'ll be no one to stop us this time! I have traced the Rebel spies to her. Now she is my only link to finding their secret base.',
  'Ye-ha! In my experience, there is no such thing as luck. I need your help, Luke. She needs your help. I\'m getting too old for this sort of thing. The more you tighten your grip, Tarkin, the more star systems will slip through your fingers.'
];

var defaultLocation = 'Springfield Hospital';

var subsituteNames = [
  'Abraham',
  'Agnes',
  'Akira',
  'Albright',
  'Allison',
  'Amadopolis',
  'Amber',
  'Apu',
  'Aristotle',
  'Arnie',
  'Artie',
  'Atkins',
  'Baby',
  'Bailey',
  'Barber',
  'Barlow',
  'Barney',
  'Bart',
  'Beardly',
  'Benjamin',
  'Bernice',
  'Bill',
  'Birch',
  'Birchibald',
  'Blinky',
  'Blue',
  'Bob',
  'Book',
  'Borton',
  'Bouvier',
  'Brandine',
  'Brockman',
  'Bumblebee',
  'Burns',
  'Capital',
  'Captain',
  'Carl',
  'Carlson',
  'Cat',
  'Cecil',
  'Chalmers',
  'Charles',
  'Charlie',
  'Chase',
  'Chief',
  'Christian',
  'City',
  'Clancy',
  'Cletus',
  'Clown',
  'Coach',
  'Comic',
  'Constance',
  'Cookie',
  'Costington',
  'Database',
  'Dave',
  'Declan',
  'Desmond',
  'Dewey',
  'Diamond',
  'Disco',
  'Dolph',
  'Doris',
  'Doug',
  'Drederick',
  'Duffman',
  'Eddie',
  'Edna',
  'Elizabeth',
  'Elves',
  'Ernst',
  'Flanders',
  'Francesca',
  'Frankie',
  'Frink',
  'Gary',
  'Gerald',
  'Gil',
  'Gino',
  'Glick',
  'Gloria',
  'Goofball',
  'Grampa',
  'Groundskeeper',
  'Gumble',
  'Gums',
  'Gunderson',
  'Gunter',
  'Guy',
  'Hans',
  'Happy',
  'Helen',
  'Helper',
  'Herbert',
  'Herman',
  'Hermann',
  'Hibbert',
  'Homer',
  'Hoover',
  'Horatio',
  'Houten',
  'Hutz',
  'Itchy',
  'Jacqueline',
  'Janey',
  'Jasper',
  'Jebediah',
  'Jimbo',
  'Joe',
  'John',
  'Johnny',
  'Jones',
  'Jordan',
  'Judge',
  'Julius',
  'Kang',
  'Kashmir',
  'Kearney',
  'Kent',
  'Kirk',
  'Kodos',
  'Krabappel',
  'Krustofski',
  'Krusty',
  'Kwan',
  'Lady',
  'Lance',
  'Largo',
  'Lenny',
  'Leonard',
  'Leopold',
  'Lewis',
  'Lindsey',
  'Ling',
  'Lionel',
  'Lisa',
  'Little',
  'Lois',
  'Loren',
  'Lou',
  'Louie',
  'Lovejoy',
  'Luann',
  'Lugash',
  'Luigi',
  'Lumpkin',
  'Lurleen',
  'Maggie',
  'Manjula',
  'Mann',
  'Marge',
  'Martin',
  'Marty',
  'Marvin',
  'Mary',
  'Maude',
  'McCallister',
  'McClure',
  'Mel',
  'Meyers',
  'Milhouse',
  'Moe',
  'Moleman',
  'Mona',
  'Monroe',
  'Montgomery',
  'Muntz',
  'Murdock',
  'Murphy',
  'Naegle',
  'Nahasapeemapetilon',
  'Ned',
  'Nelson',
  'Nick',
  'Otto',
  'Patches',
  'Patty',
  'Pennycandy',
  'Poochie',
  'Powell',
  'Powers',
  'Prince',
  'Princess',
  'Principal',
  'Pryor',
  'Pye',
  'Quimby',
  'Rachel',
  'Rainier',
  'Ralph',
  'Rich',
  'Richard',
  'Riviera',
  'Rod',
  'Roger',
  'Roy',
  'Ruth',
  'Sanjay',
  'Sarah',
  'Scott',
  'Scratchy',
  'Selma',
  'Seymour',
  'Shauna',
  'Sherri',
  'Shutton',
  'Sideshow',
  'Simpson',
  'Skinner',
  'Smithers',
  'Snowball',
  'Snyder',
  'Springfield',
  'Spuckler',
  'Stu',
  'Szyslak',
  'Tatum',
  'Taylor',
  'Teen',
  'Teeny',
  'Terri',
  'Terwilliger',
  'Timothy',
  'Todd',
  'Tony',
  'Troy',
  'Van',
  'Violet',
  'Waylon',
  'Wendell',
  'Wiggum',
  'Willie',
  'Wolfcastle',
  'Ziff',
  'Zzyzwicz',
  'Üter'
];

var anesthesiologists = [];
var physicians = [];
var radiologists = [];
/*
 * Returns a random string from the specified array of strings.
 */
function getRandomString(stringList) {
  var min = 0;
  var max = stringList.length;
  return stringList[Math.floor(Math.random() * (max - min)) + min];
}

function getFullName(listToUpdate) {
  if (listToUpdate && listToUpdate.length > 9) {
    return getRandomString(listToUpdate);
  } else {
    var fullName = getRandomString(subsituteNames) + ' ' + getRandomString(subsituteNames);
    if (listToUpdate) {
      if (listToUpdate.indexOf(fullName) === -1) {
        listToUpdate.push(fullName);
      }
    }
    return fullName;
  }
}

maindb.list({startkey: 'appointment_', include_docs: true}, function(err, results) {
  if (!err) {
    results.rows.forEach(function(result) {
      var shouldUpdate = true;
      var recordType = result.id.substr(0, result.id.indexOf('_'));
      var docToUpdate = result.doc.data;
      docToUpdate.modifiedBy = getFullName();
      switch (recordType) {
        case 'appointment': {
          docToUpdate.provider = getFullName(physicians);
          docToUpdate.location = defaultLocation;
          docToUpdate.notes = getRandomString(paragraphs);
          break;
        }
        case 'imaging': {
          docToUpdate.radiologist = getFullName(radiologists);
          docToUpdate.notes = getRandomString(paragraphs);
          docToUpdate.result = getRandomString(paragraphs);
          docToUpdate.requestedBy = getFullName(physicians);
          break;
        }
        case 'lab': {
          docToUpdate.notes = getRandomString(paragraphs);
          docToUpdate.result = getRandomString(paragraphs);
          docToUpdate.requestedBy = getFullName(physicians);
          break;
        }
        case 'lookup': {
          switch (result.id) {
            case 'lookup_2_anesthesiologists': {
              docToUpdate.value = anesthesiologists;
              break;
            }
            case 'lookup_2_physician_list': {
              docToUpdate.value = physicians;
              break;
            }
            case 'lookup_2_radiologists': {
              docToUpdate.value = radiologists;
              break;
            }
            default: {
              shouldUpdate = false;
            }
          }
          break;
        }
        case 'patientNote': {
          docToUpdate.content = getRandomString(paragraphs);
          docToUpdate.createdBy = getFullName(physicians);
          break;
        }
        case 'patient': {
          docToUpdate.country = 'United States';
          delete docToUpdate.additionalContacts;
          delete docToUpdate.address;
          delete docToUpdate.address2;
          delete docToUpdate.address3;
          delete docToUpdate.address4;
          delete docToUpdate.clinic;
          delete docToUpdate.economicClassification;
          delete docToUpdate.email;
          delete docToUpdate.expenses;
          delete docToUpdate.externalPatientId;
          delete docToUpdate.familySupport1;
          delete docToUpdate.familySupport2;
          delete docToUpdate.familySupport3;
          delete docToUpdate.familySupport4;
          delete docToUpdate.familySupport5;
          if (docToUpdate.friendlyId) {
            docToUpdate.friendlyId = docToUpdate.friendlyId.replace('TCH ','');
          }
          delete docToUpdate.familyInfo;
          docToUpdate.firstName = getRandomString(subsituteNames);
          docToUpdate.history = getRandomString(paragraphs);
          delete docToUpdate.insurance;
          docToUpdate.lastName = getRandomString(subsituteNames);
          delete docToUpdate.livingArrangement;
          if (docToUpdate.middleName && docToUpdate.middleName !== '') {
            docToUpdate.middleName = getRandomString(subsituteNames);
          }
          delete docToUpdate.notes;
          delete docToUpdate.otherIncome;
          delete docToUpdate.payments;
          docToUpdate.parent = getRandomString(subsituteNames) + ' ' + docToUpdate.lastName;
          delete docToUpdate.phone;
          delete docToUpdate.placeOfBirth;
          delete docToUpdate.referredBy;
          delete docToUpdate.socialActionTaken;
          delete docToUpdate.socialRecommendation;
          break;
        }
        case 'photo': {
          result.doc._deleted = true;
          recordsToUpdate.push(result.doc);
          shouldUpdate = false;
          break;
        }
        case 'procedure': {
          docToUpdate.anesthesiologist = getFullName(anesthesiologists);
          docToUpdate.assistant = getFullName(physicians);
          docToUpdate.location =  'OR Room 1';
          docToUpdate.notes = getRandomString(paragraphs);
          docToUpdate.physician  = getFullName(physicians);
          break;
        }
        case 'visit': {
          docToUpdate.examiner = getFullName(physicians);
          docToUpdate.history = getRandomString(paragraphs);
          docToUpdate.historySince = getRandomString(paragraphs);
          docToUpdate.location = defaultLocation;
          break;
        }
        default: {
          shouldUpdate = false;
        }
      }
      if (shouldUpdate) {
        result.doc.data = docToUpdate;
        recordsToUpdate.push(result.doc);
      }
    });
    if (recordsToUpdate.length > 0) {
      maindb.bulk({ docs: recordsToUpdate}, function(err, results) {
        if (err) {
          console.log('Error updating patient notes records.', err);
        } else {
          var updatedCount = 0;
          results.forEach(function(result) {
            if (result.ok) {
              updatedCount++;
            }
          });
          console.log('Success updating ' + updatedCount + ' out of ' + recordsToUpdate.length + ' records.');
        }
      });
    }
  } else {
    console.log('ERROR fetching records', err);
  }
});
