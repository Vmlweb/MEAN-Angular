//Modules
var process = require("process");
var path = require("path");

//Params
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //Accept self signed ssl certificates
process.env.NODE_ENV = "testing"; //Disable all logging in app

//Start app
var app = require(path.join(__dirname, "../app.js"));

//Stop app
afterAll((callback) => {
	app.shutdown(callback);
});