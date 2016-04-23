//Modules
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");

//Includes
const Config = require(__config);

//Prepare connection string
const auth = Config.database.auth.username + ":" + Config.database.auth.password;
const nodes = [];
for (var i=0; i<Config.database.repl.nodes.length; i++){
	nodes.push(Config.database.repl.nodes[i].hostname + ":" + Config.database.repl.nodes[i].port);
}
const database = Config.database.auth.database;
const repl = "replicaSet=" + Config.database.repl.name + "&ssl=" + Config.database.ssl.enabled;

//Prepare connection options
const options = { 
	replset: {
		sslValidate: Config.database.ssl.validate,
		sslKey: Config.database.ssl.validate ? fs.readFileSync(path.join(__certs, Config.database.ssl.key)) : null,
		sslCert: Config.database.ssl.validate ? fs.readFileSync(path.join(__certs, Config.database.ssl.cert)) : null,
		sslCA: Config.database.ssl.validate ? fs.readFileSync(path.join(__certs, Config.database.ssl.ca)) : null,
		readPreference: Config.database.repl.read || "nearest"
	}
};

//Connect to database
const url = "mongodb://" + auth + "@" + nodes.join(",") + "/" + database + "?" + repl;
mongoose.connect(url, options);

//Database events
mongoose.connection.on("error", (error) => {
	log.error("Error connecting to database at " + nodes.join(","), error.message);
});
mongoose.connection.once("open", () => {
	log.info("Connected " + (Config.database.ssl.enabled ? "securely " : "" ) + "to database at " + nodes.join(","));
});
mongoose.connection.on("close", () => {
	log.info("Database connection ended and stream closed");
});

module.exports = mongoose;