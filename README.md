HospitalRun Server
======
This is the Node.js backend for HospitalRun.  The intention is that this would be used in HospitalRun production deployments.
Having a Node.js backend server allows us to do the following:

Full deployment documentation is available at [HospitalRun Deployment](https://confluence.ehealthafrica.org/display/HD/)

1. Use Google OAuth for user authentication.
2. Provide a proxy for CouchDB.
3. Integrate with ElasticSearch for better search capability.
4. The capability to define CouchDB database listeners that react to changes in the database.  At present, there are 3 database listeners, located in the dblisteners directory:
 * **file-upload** - Uploads patient images to the server
 * **lookup-import** - Utility to import lookup lists from the frontend.
 * **merge-conflicts** - Checks for couchdb conflicts and resolves using a strategy of accepting the last change at a field level.

## Installation with Docker
This is the preferred and advisable way of running `hospitalrun-server`
1. Clone files into your server
2. Edit the `docker-compose.yml` file and replace `www.example.com` in `DOMAIN_NAME: www.example.com` with your domain name
3. Run `docker-compose up -d` and wait a couple of minutes depending on how much bandwidth you have. Visit your domain name to see `hospitalrun in action`

## Alternative Installation
1. Make sure you have installed [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. Make sure you have installed [Node.js 4.x](https://nodejs.org/en/download/) https://nodejs.org/en/download/
3. Clone this repo with `git clone https://github.com/HospitalRun/hospitalrun-server`
4. Run ```npm install``` in the newly clone directory to install the HospitalRun dependencies
5. Install and configure [CouchDB 1.6.1](http://couchdb.apache.org/)
    1. Download and install CouchDB 1.6.1 from http://couchdb.apache.org/#download. Please makes sure you use Couch 1.x and not Couch 2.x as Couch 2.x is not fully supported at this time.
    2. Start CouchDB
        1. If you downloaded the installed app, navigate to CouchDB and double-click on the application.
        2. If you installed CouchDB via Homebrew or some other command line tool, launch the tool from the command line
        3. If you're stuck with the installation, check out the instructions published here: http://docs.couchdb.org/en/1.6.1/install/index.html
    3. Verify that CouchDB is running by successfully navigating to 127.0.0.1:5984/_utils. If that fails, check the installation guide for CouchDB http://docs.couchdb.org/en/1.6.1/install/index.html
    4. Setup CouchDB for HospitalRun:
        1. Download https://github.com/HospitalRun/hospitalrun-frontend/blob/master/script/initcouch.sh
        2. If you have just installed CouchDB and have no admin user, simply run `initcouch.sh` with no arguements.  A user `hradmin` will be created with password: `test`.
        2. If you already have a CouchDB admin user, please run `initcouch.sh USER PASS`.  `USER` and `PASS` are the CouchDB admin user credentials.
6. Copy the config-example.js to config.js in the folder you cloned the HospitalRun repo. If you already had a CouchDB admin user that you passed into the couch script (initcouch.sh USER PASS), then you will need to modify the couchAdminUser and couchAdminPassword values in config.js to reflect those credentials.
7. If you are on Linux distribution that uses Upstart, there is an upstart script in utils/hospitalrun.conf.  By default this script assumes the server is installed at /var/app/server. This script relies on [forever](https://github.com/foreverjs/forever) which you will need to install via npm: ```npm install -g forever```
   * alternatively you can run server using npm's scripts `npm start` (this is not recommended for production usage).
8. Search on the HospitalRun Server uses [elasticsearch](https://github.com/elastic/elasticsearch).  You will also need the [CouchDB River Plugin for Elasticsearch](https://github.com/elastic/elasticsearch-river-couchdb) and the [JavaScript language Plugin for elasticsearch](https://github.com/elastic/elasticsearch-lang-javascript).  If you are installing on a debian server you can use the following steps to setup elasticsearch and java (if needed):

    ```
    wget -qO - https://packages.elasticsearch.org/GPG-KEY-elasticsearch | sudo apt-key add -
    echo "deb http://packages.elastic.co/elasticsearch/1.6/debian stable main" | sudo tee -a /etc/apt/sources.list
    sudo add-apt-repository ppa:webupd8team/java
    sudo apt-get update
    sudo apt-get install oracle-java8-installer elasticsearch
    sudo update-rc.d elasticsearch defaults 95 10
    cd /usr/share/elasticsearch/
    sudo bin/plugin install elasticsearch/elasticsearch-river-couchdb/2.6.0
    sudo bin/plugin -install elasticsearch/elasticsearch-lang-javascript/2.6.0
    ```
9. Add the following line to /etc/elasticsearch/elasticsearch.yml (or wherever your elasticsearch configuration is located):

    ```
    script.disable_dynamic: false
    ```
10. Start elasticsearch.  On debian/ubuntu: ```service elasticsearch start```
11. Run the setup script for linking couchdb to elasticsearch.  You will need to specify the username and password for the hospitalrun admin account you created with initcouch.sh in [HospitalRun/frontend](https://github.com/HospitalRun/frontend/blob/master/script/initcouch.sh):

    ```
    /utils/elasticsearch.sh hradmin password
    ```
## Inventory Import
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
