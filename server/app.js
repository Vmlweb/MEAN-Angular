//Modules
const path = require("path");
const async = require("async");

//Setup
const dirs = require("./dirs.js");
const logger = require(__app + "/logger.js");
const mongo = require(__app + "/mongo.js");
const express = require(__app + "/express.js");

//Config
const Config = require(__config);

//Setup mocks
if (process.env.NODE_ENV === "testing"){
	require(__app + "/time.test.js");
	log.info("Setup test mocks and stubs");
}

//Shutdown services
const shutdown = (callback) => {
	log.info("Shutting down gracefully...");
	
	//Run all shutdown tasks in series
	async.series([
		(done) => {
		    
			//HTTP
		    if (express.hasOwnProperty("http")){
				express.http.close(() => {
					done(null);
				});
			}else{
				done(null);
			}

		}, (done) => {

			//HTTPS
			if (express.hasOwnProperty("https")){
				express.https.close(() => {
					done(null);
				});
			}else{
				done(null);
			}
		}, (done) => {

			//MongoDB
			if (Config.database.repl.nodes.length > 0){
				mongo.connection.close(() => {
					done(null);
				});
			}else{
				done(null);
			}
		}
	], (error) => {
		
		//Execute error callback
		if (callback !== null){
			callback(error);
		}
	});
};
exports.shutdown = shutdown;

//Graceful shutdown
const force = (error) => {
	
	//Exit with or without error
	if (error){
		log.error(error);
		process.exit(1);
	}else{
		process.exit();
	}
	
	//Shutdown timeout after 4 seconds
	setTimeout(() => {
		log.error("Shutdown timed out, force quitting");
		process.exit();
	}, 2000);
};

//Intercept kill and end signals
process.on("SIGTERM", () => { shutdown(force); });
process.on("SIGINT", () => { shutdown(force); });