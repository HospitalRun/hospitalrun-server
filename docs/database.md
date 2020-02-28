# DataBase
HospitalRun v2.0.0 uses CouchDB v3.0.0.

[CouchDB](https://docs.couchdb.org/en/master/index.html) is an opensource, secure and scalable DataBase. [pouchdb](https://pouchdb.com/api.html), used on the HospitalRun FE for its offline-first capabilities, implements CouchDB's replication protocol and therfore CouchDB is our remote data source.

Since HospitalRun is a multi-tenant app, one of the most important things to consider is a full data isolation for every tenant. We are using one DB per tenant approach. Every DB is has [partitioned](https://docs.couchdb.org/en/master/partitioned-dbs/index.html#partitions-by-example) flag set to true. The partiion key is the hospital name.

## DataBase naming
Every database has a unique name, made by organization's name and a randomly generated [shortid](https://www.npmjs.com/package/shortid). The organization's name has to be [slugified](https://www.npmjs.com/package/slugify) before using it: ``` `${slugify(organization_name)}-${shortid.generate()` ```

For example, if an ONG is called "cure" the database assigned to it will be `cure-PPBqWA9`.

Hospital name will be used as the db's parition key: ``` `${AIC-CURE:patient-ca33c748-2d2c-4ed1-8abf-1bca4d9d03cf}` ```

This approach has two main benefits:

1. On the CouchDB side we can leverage the new 3.0.0 sharding features and ensure that every data from the same hospital will be saved "nearby".
2. ON the pouchdb we can make ONG's admin that can see the data from all hospitals on the same app. Another benefit is that we can allow this superadmins to create new hospitals, users (accross all hospitals) and ONG's admins.


## Things we need
Since CouchDB uses [map-reduce](https://docs.couchdb.org/en/master/ddocs/ddocs.html#view-functions) design documents for querying we need to make their ergonomics better, to increase developer expierence:

* Typings for CouchDB integrated functions, for example emit
* Auto-compile functions to strings to insert in CouchDB:
  * developers write these functions in a specific files and their are automatically "compiled" to strings, ready to be saved on the server
* Conditional Typings on saved entites object saved
  * we need TypeScript editor support for our saved docs, for example in the map function
```typescript
function (doc: HRDoc) {
  if (doc.type === 'patient') {
    // here HRDoc will be of Patient type and all of its properties will be typed
    // doc.visits has Visit[] type automatically
    doc.visits.forEach(function (visit) {
      // visit has Visit type automatically
      emit(doc._id, visit.date);
    });
  }
}
```

Every new user and tenant will be created on the CouchDB side, using a fastify exposed API. It is possibile to create new users only when online: we can perform checks and assign correct permissions on the server side. No local pouchdb changes to the core dbs (_users, _sessions etc) are allowed.
