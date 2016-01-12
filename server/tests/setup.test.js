//Setup
beforeAll(function(done){
	
	//Params
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //Accept self signed ssl certificates
	process.env.NODE_ENV = "silent"; //Disable all logging in app
	
	//Load database connection and logger
	var logger = require("../app/logger.js");
	var mongo = require("../app/mongo.js");
	
	//Wait 1 second for load
	setTimeout(done, 1000);
});