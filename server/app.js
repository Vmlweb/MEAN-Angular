//Modules
var path = require("path");
var async = require("async");

//Setup
var dirs = require("./dirs.js");
var logger = require(__app + "/logger.js");
var mongo = require(__app + "/mongo.js");
var express = require(__app + "/express.js");

//Setup mocks
if (process.env.NODE_ENV === "testing"){
	require(__app + "/time.test.js");
	
	log.info("Setup test mocks and stubs");
}

//Graceful shutdown
var shutdown = function() {
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

		},
		function(done){

			//HTTPS
			if (express.hasOwnProperty("https")){
				express.https.close(function(){
					done(null);
				});
			}else{
				done(null);
			}
		}
	], function(error){

		//Exit with or without error
		if (error){
			log.error(error);
			process.exit(1);
		}else{
			process.exit();
		}
	});
	
	//Shutdown timeout after 4 seconds
	setTimeout(function() {
		log.error("Shutdown timed out, force quitting");
		process.exit();
	}, 2000);
};

//Intercept kill and end signals
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);