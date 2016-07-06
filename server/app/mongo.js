//Modules
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

//Includes
const config = require(__config);

//Prepare connection string
let auth = config.database.auth.username + ':' + config.database.auth.password;
let nodes = [];
for (let i=0; i<config.database.repl.nodes.length; i++){
	nodes.push(config.database.repl.nodes[i].hostname + ':' + config.database.repl.nodes[i].port);
}
let database = config.database.auth.database;
let repl = 'replicaSet=' + config.database.repl.name + '&ssl=' + config.database.ssl.enabled;

//Prepare connection options
let options = { 
	replset: {
		sslValidate: config.database.ssl.validate,
		sslKey: config.database.ssl.validate ? fs.readFileSync(path.join(__certs, config.database.ssl.key)) : null,
		sslCert: config.database.ssl.validate ? fs.readFileSync(path.join(__certs, config.database.ssl.cert)) : null,
		sslCA: config.database.ssl.validate ? fs.readFileSync(path.join(__certs, config.database.ssl.ca)) : null,
		readPreference: config.database.repl.read || 'nearest'
	}
};

//Connect to database
let url = 'mongodb://' + auth + '@' + nodes.join(',') + '/' + database + '?' + repl;
mongoose.connect(url, options);

//Database events
mongoose.connection.on('error', function(error){
	log.error('Error connecting to database at ' + nodes.join(','), error.message);
});
mongoose.connection.once('open', function(){
	log.info('Connected ' + (config.database.ssl.enabled ? 'securely ' : '' ) + 'to database at ' + nodes.join(','));
});
mongoose.connection.on('close', function(){
	log.info('Database connection ended and stream closed');
});

module.exports = mongoose;