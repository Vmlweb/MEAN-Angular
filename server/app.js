//Modules
var async = require("async");

//Config
var dirs = require("./dirs.js");
var Config = require(__config);

//Setup
var logger = require(__app + "/logger.js");
var mongo = require(__app + "/mongo.js");
var express = require(__app + "/express.js");

//Setup mocks
if (process.env.NODE_ENV === "testing"){
	require(__app + "/time.test.js");
	
	log.info("Setup test mocks and stubs");
}

//Shutdown services
var shutdown = function(callback){
	log.info("Shutting down gracefully...");
	
	//Run all shutdown tasks in series
	async.series([
		function(done){
		    
			//HTTP
		    if (express.hasOwnProperty("http")){
				express.http.close(function(){
					done(null);
				});
			}else{
				done(null);
			}

		}, function(done){

			//HTTPS
			if (express.hasOwnProperty("https")){
				express.https.close(function(){
					done(null);
				});
			}else{
				done(null);
			}
		}, function(done){

			//MongoDB
			if (Config.database.repl.nodes.length > 0){
				mongo.connection.close(function () {
					done(null);
				});
			}else{
				done(null);
			}
		}
	], function(error){
		
		//Execute error callback
		if (callback !== null){
			callback(error);
		}
	});
};
exports.shutdown = shutdown;

//Graceful shutdown
var force = function(error) {
	
	//Exit with or without error
	if (error){
		log.error(error);
		process.exit(1);
	}else{
		process.exit();
	}
	
	//Shutdown timeout after 4 seconds
	setTimeout(function() {
		log.error("Shutdown timed out, force quitting");
		process.exit();
	}, 2000);
};

//Intercept kill and end signals
process.on("SIGTERM", function(){ shutdown(force); });
process.on("SIGINT", function(){ shutdown(force); });