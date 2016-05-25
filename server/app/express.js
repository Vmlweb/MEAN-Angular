//Modules
var https = require("https");
var http = require("http");
var fs = require("fs");
var path = require("path");
var morgan = require("morgan");
var recursive = require("recursive-readdir");
var async = require("async");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var compression = require("compression");
var filter = require('content-filter');
var express = require("express");
var app = express();
module.exports = { app: app, connections: { http: {}, https: {} } };

//Includes
var config = require(__config);

log.info("Express initialized");

//Attach access logging to express
app.use(require("morgan")(config.logs.format, { "stream": log.stream }));

//Request Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(filter());
app.use(helmet());
app.use(compression());

log.info("Express middleware attached");

//HTTP Listen
if (config.http.hostname !== ""){
	
	//Create server and listen
	module.exports.http = http.createServer(app).listen(config.http.port.internal, config.http.hostname);
	
	//New connections
	module.exports.http.on("connection", function(conn){
		var key = conn.remoteAddress + ':' + conn.remotePort;
	    module.exports.connections.http[key] = conn;
	    conn.on('close', function() {
		    delete module.exports.connections.http[key];
	    });
	});
	
	//Logging for events
	module.exports.http.on("close", function(){
		log.info("HTTP server ended and stream closed");
	});
	log.info("HTTP listening at " + config.http.hostname + ":" + config.http.port.internal);
}

//HTTPS Listen
if (config.https.hostname !== "" && config.https.ssl.key !== "" && config.https.ssl.cert !== ""){
	
	//Create server and listen
	module.exports.https = https.createServer({
		key: fs.readFileSync(path.join(__certs, config.https.ssl.key)) || "",
		cert: fs.readFileSync(path.join(__certs, config.https.ssl.cert)) || ""
	}, app).listen(config.https.port.internal, config.https.hostname);
	
	//New connections
	module.exports.https.on("connection", function(conn){
		var key = conn.remoteAddress + ':' + conn.remotePort;
	    module.exports.connections.https[key] = conn;
	    conn.on('close', function() {
		    delete module.exports.connections.https[key];
	    });
	});
	
	//Logging for events
	module.exports.https.on("close", function(){
		log.info("HTTPS server ended and stream closed");
	});
	log.info("HTTPS listening at " + config.https.hostname + ":" + config.https.port.internal);
}

//Static routes for public folder
app.use(express.static(__client));

log.info("Setup client static routes");

//Load api calls from file
recursive(__api, function (err, files) {
	
	//Remove all non router files
	var includeFiles = [];
	for (var i=0; i<files.length; i++){
		if (files[i].indexOf(".get.js") >= 0 ||
			files[i].indexOf(".post.js") >= 0 ||
			files[i].indexOf(".put.js") >= 0 ||
			files[i].indexOf(".delete.js") >= 0){
			includeFiles.push(files[i]);
		}
	}
	
	//Routing handler for api calls
	if (err){
		log.error(err.message);	
	}else{
		
		//Log endpoint count
		log.info("Loaded " + includeFiles.length + " api endpoints");
		
		//Import individual api routers
		for (var a=0; a<includeFiles.length; a++){
			var route = require(includeFiles[a]);
			app.use("/api", route);
		}
	}
	
	log.info("Setup routes for api endpoints");
	
	//Error handler for server side api requests
	app.use("/api", function(req, res, next){
		res.status(404).json({ error: "NotFoundError" });
	});
	app.use("/api", function(err, req, res, next){
		if (err instanceof String || typeof err === "string"){
			
			//User error 
			res.status(200).json({ error: err });
		}else{
			
			//Interal server error
			if (err.hasOwnProperty("message") && err.hasOwnProperty("error")){
				log.error(err.message, err.error);
			}else if (err.hasOwnProperty("message")){
				log.error(err.message, err.stack);
			}else if (err.hasOwnProperty("error")){
				log.error(err.error);
			}else{
				log.error("Internal server error", err.stack);	
			}
			res.status(500).json({ error: "ServerError" });
		}
	});
	
	//Error handler for client side requests
	app.get("*", function(req, res, next){
		res.status(404).redirect("/errors/404.html");
	});
	app.get("*", function(err, req, res, next){
		log.error(err.stack);
		res.status(500).redirect("/errors/500.html");
	});

	log.info("Setup error handling routes");
});