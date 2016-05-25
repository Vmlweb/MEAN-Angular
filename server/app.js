//Modules
var path = require("path");
var async = require("async");

//Config
var dirs = require("./dirs.js");
var config = require(__config);

//Setup
module.exports = {
	logger: require(__app + "/logger.js"),
	mongo: require(__app + "/mongo.js"),
	express: require(__app + "/express.js")
};

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
		    if (module.exports.express.hasOwnProperty("http")){
			    
			    //Destroy existing keep-alive connections
				setTimeout(function(){
					log.info("HTTP connections killed");
					for (var i in module.exports.express.connections.http){
						module.exports.express.connections.http[i].destroy();
					}
				}, 3000).unref();
			    
			    //Close server and socket
			    module.exports.express.http.close(function(){
					done();
				});
			}else{
				done();
			}
		}, function(done){

			//HTTPS
			if (module.exports.express.hasOwnProperty("https")){
			
				//Destroy existing keep-alive connections
				setTimeout(function(){
					log.info("HTTPS connections killed");
					for (var i in module.exports.express.connections.https){
						module.exports.express.connections.https[i].destroy();
					}
				}, 3000).unref();
			
				//Close server and socket
			    module.exports.express.https.close(function(){
					done();
				});
			}else{
				done();
			}
		}, function(done){

			//MongoDB
			if (config.database.repl.nodes.length > 0){
				module.exports.mongo.connection.close(function () {
					done();
				});
			}else{
				done();
			}
		}
	], function(error){
		if (callback){
			callback(error);
		}
	});
};
module.exports.shutdown = shutdown;

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
module.exports.force = force;

//Intercept kill and end signals
process.on("SIGTERM", function(){ shutdown(force); });
process.on("SIGINT", function(){ shutdown(force); });