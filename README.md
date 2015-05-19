HosptialRun Server
======
This is the Node.js backend for HospitalRun.  The intention is that this would be used in HospitalRun production deployments.
Having a Node.js backend server allows us to do the following:

1. Use Google OAuth for user authentication.
2. Provide a proxy for CouchDB.  
3. Integrate with ElasticSearch for better search capability.
4. The capabilty to define CouchDB database listeners that react to changes in the database.  At present, there are 3 database listeners, located in the dblisteners directory:
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