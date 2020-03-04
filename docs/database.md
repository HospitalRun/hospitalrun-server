# DataBase
HospitalRun v2.0.0 uses CouchDB v3.0.0.

[CouchDB](https://docs.couchdb.org/en/master/index.html) is an opensource, secure and scalable DataBase. [PouchDB](https://pouchdb.com/api.html), that implements CouchDB's replication protocol, is used on the [HospitalRun FE](https://github.com/HospitalRun/hospitalrun-frontend) for its offline-first capabilities: CouchDB and PouchDB are automatically synced.

Since HospitalRun is a multi-tenant app, one of the most important things to consider for us is a proper data isolation between tenants. In order to achieve it we flow one DB per tenant approach. Every DB has the newly introduced [partitioned](https://docs.couchdb.org/en/master/partitioned-dbs/index.html#partitions-by-example) flag set to true, so it can be sharded and scaled horizontally in a better way: the partiion key is the hospital name.

## DataBase naming
Every database has a unique name, made by organization's name and a randomly generated [shortid](https://www.npmjs.com/package/shortid). The organization's name has to be [slugified](https://www.npmjs.com/package/slugify) before being used: ``` `${slugify(organization_name)}-${shortid.generate()` ```

For example, if an ONG is called "cure" the database assigned to it will be `cure-PPBqWA9`.

As said, hospital name will be used as db's parition key. For example if the name is `AIC-CURE` it will be ``` `${AIC-CURE:patient-ca33c748-2d2c-4ed1-8abf-1bca4d9d03cf}` ```

This implementation has two main benefits:

1. On CouchDB side, we can leverage the new 3.0.0 sharding features and ensure that every data from the same hospital will be saved "nearby".
2. On PouchDB side, we can allow the ONG admin to see data from all hospitals of its organization. In fact, we allow superadmins to create new hospitals, users (accross ONG hospitals) and ONG admins.


## Developer flow
Since CouchDB uses [map-reduce](https://docs.couchdb.org/en/master/ddocs/ddocs.html#view-functions) design documents for querying, we need to make their ergonomics better and make developer expierence more pleasant:

- [x] Typings for [CouchDB JavaScript design document context](https://docs.couchdb.org/en/latest/query-server/javascript.html#design-functions-context)
  - [HospitalRun JavaScript design document context](https://github.com/HospitalRun/hospitalrun-server/blob/master/src/db/design-functions-context.d.ts)
- [x] Conditional generic typings that propagate our model interfaces to CouchDB JavaScript design document context
  - [HospitalRun Design Document interface](https://github.com/HospitalRun/hospitalrun-server/blob/master/src/db/design-document.ts)
```typescript
import Design from '../design-document'

interface Patient {
  _id: string
  name: string
  status: 'ALIVE' | 'DEAD'
}

const PatientDesign: Design<Patient> = {
  _id: '_design/patient',
  language: 'javascript',
  shows: {
    jsonStringify(doc) {
      provides('json', function() {
        return JSON.stringify(doc)
      })
    },
  },
  updates: {
    updateOrCreate(doc, _) {
      if (!doc) {
        doc = {} as any
      }
      if (!doc?._id) {
        doc!._id = 'baz'
      }
      return [{ _id: 'baz' }, 'baz']
    },
  },
  views: {
    by_date: {
      map: doc => {
        if ((doc.status = 'ALIVE')) {
          emit(doc._id, doc)
        }
      },
    },
  },
}
export default PatientDesign

```


- [x] CLI to auto compile TypeScript design documents to json files used by CouchDB
  - [HospitalRun ddoc cli](https://github.com/HospitalRun/hospitalrun-server/blob/master/src/bin/ddoc.ts)


## TODO
- [ ] user creation : every new user and tenant will be created on the CouchDB side, using a Fastify exposed API. For an admin, it is possibile to create new user only when online: we perform checks and assign correct permissions on the server side. No local pouchdb changes to the core dbs (_users, _sessions etc) are allowed.
