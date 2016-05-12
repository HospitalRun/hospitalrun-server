HospitalRun Server
======
This is the Node.js backend for HospitalRun.  The intention is that this would be used in HospitalRun production deployments.
Having a Node.js backend server allows us to do the following:

1. Use Google OAuth for user authentication.
2. Provide a proxy for CouchDB.
3. Integrate with ElasticSearch for better search capability.
4. The capability to define CouchDB database listeners that react to changes in the database.  At present, there are 3 database listeners, located in the dblisteners directory:
 * **file-upload** - Uploads patient images to the server
 * **lookup-import** - Utility to import lookup lists from the frontend.
 * **merge-conflicts** - Checks for couchdb conflicts and resolves using a strategy of accepting the last change at a field level.

##Installation
1. The HospitalRun server expects that the [HospitalRun frontend](https://github.com/HospitalRun/frontend) is available in server/public and has been compiled using the command:
```
ember build --environment production --output-path ../server/public
```
This assumes that you have frontend and server in the same parent directory.  You could specify another directory as the output path in frontend and then use a symbolic link in server/public to point to your production build.

2. Run ```npm install``` to install the HospitalRun dependencies
3. In the server directory copy config-example.js to config.js and configure db passwords etc in config.js
4. If you are on Linux distribution that uses Upstart, there is an upstart script in utils/hospitalrun.conf.  By default this script assumes the server is installed at /var/app/server. This script relies on [forever](https://github.com/foreverjs/forever) which you will need to install via npm: ```npm install -g forever```
   * alternatively you can run server using npm's scripts `npm start` (this is not recommended for production usage).
5. Search on the HospitalRun Server uses [elasticsearch](https://github.com/elastic/elasticsearch).  You will also need the [CouchDB River Plugin for Elasticsearch](https://github.com/elastic/elasticsearch-river-couchdb) and the [JavaScript language Plugin for elasticsearch](https://github.com/elastic/elasticsearch-lang-javascript).  If you are installing on a debian server you can use the following steps to setup elasticsearch and java (if needed):
  ```
wget -qO - https://packages.elasticsearch.org/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb http://packages.elastic.co/elasticsearch/1.4/debian stable main" | sudo tee -a /etc/apt/sources.list
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer elasticsearch
sudo update-rc.d elasticsearch defaults 95 10
cd /usr/share/elasticsearch/
sudo bin/plugin install elasticsearch/elasticsearch-river-couchdb/2.4.2
sudo bin/plugin -install elasticsearch/elasticsearch-lang-javascript/2.4.1
```

6. Add the following line to /etc/elasticsearch/elasticsearch.yml (or wherever your elasticsearch configuration is located):
```
script.disable_dynamic: false
```

7. Start elasticsearch.  On debian/ubuntu: ```service elasticsearch start```
8. Run the setup script for linking couchdb to elasticsearch.  You will need to specify the username and password for the hosptialrun admin account you created with initcouch.sh in [HospitalRun/frontend](https://github.com/HospitalRun/frontend/blob/master/initcouch.sh):
```
/server/utils/elasticsearch.sh hradmin password
```

##Inventory Import
There is a utility located under utils/inv-import.js that will allow you to import inventory from a CSV.  To use it, run the following command
`node utils/inv-import.js file.csv YYYY-MM-DD`, eg `node utils/inv-import.js file.csv 2015-12-31`

The date specified will be used as the date that the purchases were received. 

The csv fields that are supported are as follows:

-  **aisleLocation** (optional) - if item is in a particular aisle in a location, specify that name here.
- **distributionUnit** (optional) - the unit type used when this item is distributed in the hospital.  You can see the valid values in the app at Admin/Lookup Lists/Unit Types.  If there is a distribution unit you use that is not in the list, you can add it on this screen.
- **expirationDate** (optional) - format is `MM/DD/YYYY`
- **giftInKind** (optional) - value should be `Yes` if item is gift in kind
- **location**(optional) - Location of item
- **lotNumber** (optional) - Lot number of item
- **name** (required) - Display name of item
- **purchaseCost** (required) - Total purchase cost for the items.  This would be the cost per unit x the quantity.  The purchase cost is used with the quantity to determine the cost per unit.
- **quantity** (required) - Number of items.
- **type** - use `Medication` for medicine; other types can be specified, but they should be added in the interface through Admin/Lookup Lists/Inventory Types
- **vendor** (optional) - Name of vendor who supplied item 
- **vendorItemNo** (optional) - Vendor item number

The first row of the csv file needs to have the columnName as specified above so that the import tool knows which value is in which column.
