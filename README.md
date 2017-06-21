HospitalRun Server
======
This is the Node.js backend for HospitalRun.  The intention is that this would be used in HospitalRun production deployments. Having a Node.js backend server allows us to do the following:

1. Use Google OAuth for user authentication.
2. Provide a proxy for CouchDB.
3. Integrate with ElasticSearch for better search capability.
4. The capability to define CouchDB database listeners that react to changes in the database.  At present, there are 3 database listeners, located in the dblisteners directory:
 * **file-upload** - Uploads patient images to the server
 * **lookup-import** - Utility to import lookup lists from the frontend.
 * **merge-conflicts** - Checks for couchdb conflicts and resolves using a strategy of accepting the last change at a field level.

## Installation with Docker
This is the preferred and recommended way of running `hospitalrun-server`.

Full deployment documentation is available [here](https://github.com/HospitalRun/hospitalrun-server/blob/master/DEPLOYMENT_GUIDE.md).

## Alternative Installation
1. Make sure you have installed [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. Make sure you have installed [Node.js 6.x](https://nodejs.org/en/download/)
3. Clone this repository with `git clone https://github.com/HospitalRun/hospitalrun-server`
4. Run `npm install` in the newly cloned directory to install the HospitalRun dependencies
5. Install and configure [CouchDB 1.6.1](http://couchdb.apache.org/)
    1. Download and install CouchDB 1.6.1 from [here](http://couchdb.apache.org/#download). Please makes sure you use Couch 1.x and not Couch 2.x as Couch 2.x is not fully supported at this time.
    2. Start CouchDB
        1. If you downloaded the installed app, navigate to CouchDB and double-click on the application.
        2. If you installed CouchDB via Homebrew or some other command line tool, launch the tool from the command line
        3. If you're stuck with the installation, check out the instructions published [here](http://docs.couchdb.org/en/1.6.1/install/index.html)
    3. Verify that CouchDB is running by successfully navigating to 127.0.0.1:5984/_utils. If that fails, check the [installation guide](http://docs.couchdb.org/en/1.6.1/install/index.html) for CouchDB
    4. Setup CouchDB for HospitalRun:
        1. Download `https://github.com/HospitalRun/hospitalrun-frontend/blob/master/script/initcouch.sh`
        2. If you have just installed CouchDB and have no admin user, simply run `initcouch.sh` with no arguements.  A user `hradmin` will be created with password: `test`.
        2. If you already have a CouchDB admin user, please run `initcouch.sh USER PASS`.  `USER` and `PASS` are the CouchDB admin user credentials.
6. Copy the `config-example.js` to `config.js` in the folder you cloned the HospitalRun repository. If you already had a CouchDB admin user that you passed into the couch script (`initcouch.sh USER PASS`), then you will need to modify the `couchAdminUser` and `couchAdminPassword` values in `config.js` to reflect those credentials.  Additionally the default network name for the CouchDB server is `couchdb`.  If you are runninig CouchDB on the same server as HospitalRun, change line 2 of `config.js` from: 
```js
var config = {
  couchDbServer: 'couchdb',
```
to:
```js
var config = {
  couchDbServer: 'localhost',
```
7. If you are on Linux distribution that uses **Upstart**, there is an upstart script in `utils/hospitalrun.conf`.  By default this script assumes the server is installed at `/var/app/server`. This script relies on [forever](https://github.com/foreverjs/forever) which you will need to install via npm: `npm install -g forever`
   * alternatively you can run server using npm's scripts `npm start` (this is not recommended for production usage).
8. Search on the HospitalRun Server uses [Elasticsearch 5.x](https://www.elastic.co/products/elasticsearch) and [Logstash 5.x](https://www.elastic.co/products/logstash). If you are installing on a debian server you can use the following steps to setup elasticsearch and java (if needed):

    ```bash
    wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
    echo "deb https://artifacts.elastic.co/packages/5.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-5.x.list
    sudo apt-get install apt-transport-https
    sudo add-apt-repository ppa:webupd8team/java
    sudo apt-get update
    sudo apt-get install oracle-java8-installer elasticsearch logstash
    sudo /usr/share/logstash/bin/logstash-plugin update --no-verify logstash-input-couchdb_changes
    sudo cp -r logstash/pipeline /usr/share/logstash
    sudo cp -r logstash/config /usr/share/logstash
    sudo service logstash restart
    sudo service elasticsearch restart
    ```

## Inventory Import
There is a utility located under `utils/inv-import.js` that will allow you to import inventory from a CSV.  To use it, run the following command

`node utils/inv-import.js file.csv YYYY-MM-DD`, for example `node utils/inv-import.js file.csv 2015-12-31`

The date specified will be used as the date that the purchases were received.

The csv fields that are supported are as follows:

- **name** (required) - Display name of item
- **purchaseCost** (required) - Total purchase cost for the items.  This would be the cost per unit x the quantity.  The purchase cost is used with the quantity to determine the cost per unit.
- **quantity** (required) - Number of items.
- **type** (required) - use `Medication` for medicine; other types can be specified, but they should be added in the interface through Admin/Lookup Lists/Inventory Types
-  **aisleLocation** (optional) - if item is in a particular aisle in a location, specify that name here.
- **distributionUnit** (optional) - the unit type used when this item is distributed in the hospital.  You can see the valid values in the app at Admin/Lookup Lists/Unit Types.  If there is a distribution unit you use that is not in the list, you can add it on this screen.
- **expirationDate** (optional) - format is `MM/DD/YYYY`
- **giftInKind** (optional) - value should be `Yes` if item is gift in kind
- **location**(optional) - Location of item
- **lotNumber** (optional) - Lot number of item
- **vendor** (optional) - Name of vendor who supplied item
- **vendorItemNo** (optional) - Vendor item number

The first row of the csv file needs to have the columnName as specified above so that the import tool knows which value is in which column.

## DB to CSV
There is a utility located under `utils/db-to-csv.js` that will allow you to dump the database to CSV.  To use it, run the following command
`node utils/db-dump.js <type> <filename> <dbname>`, for example `node utils/db-dump.js inventory`

The following parameters are supported:

-  **type** (required) - the type of object to dump from the database (eg inventory).  For a list of available types, run `node utils/db-to-csv.js --types`
- **filename** (optional) - the name of the file to write to.  If not specifed, this will default to type.csv (eg inventory.csv for inventory type).
- **dbname** (optional) - the name of the database to dump from.  If not specifed, this will default to the main database for HospitalRun.
