//Modules
var path = require("path");
var mongoose = require("mongoose");
var fs = require("fs");

//Includes
var Config = require(__config);

//Prepare connection string
var auth = Config.database.auth.username + ":" + Config.database.auth.password;
var nodes = [];
for (var i=0; i<Config.database.repl.nodes.length; i++){
	nodes.push(Config.database.repl.nodes[i].hostname + ":" + Config.database.repl.nodes[i].port);
}
var database = Config.database.auth.database;
var repl = "replicaSet=" + Config.database.repl.name + "&ssl=" + Config.database.ssl.enabled;

//Prepare connection options
var options = { 
	replset: {
		sslValidate: Config.database.ssl.validate,
		sslKey: Config.database.ssl.validate ? fs.readFileSync(path.join(__certs, Config.database.ssl.key)) : null,
		sslCert: Config.database.ssl.validate ? fs.readFileSync(path.join(__certs, Config.database.ssl.cert)) : null,
		sslCA: Config.database.ssl.validate ? fs.readFileSync(path.join(__certs, Config.database.ssl.ca)) : null,
		readPreference: Config.database.repl.read || "nearest"
	}
};

//Connect to database
var url = "mongodb://" + auth + "@" + nodes.join(",") + "/" + database + "?" + repl;
mongoose.connect(url, options);

//Database events
mongoose.connection.on("error", function(error){
	log.error("Error connecting to database at " + nodes.join(","), error.message);
});
mongoose.connection.once("open", function(){
	log.info("Connected " + (Config.database.ssl.enabled ? "securely " : "" ) + "to database at " + nodes.join(","));
});
mongoose.connection.on("close", function(){
	log.info("Database connection ended and stream closed");
});

module.exports = mongoose;