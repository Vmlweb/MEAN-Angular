//Modules
const process = require('process');
const path = require('path');

//Params
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; //Accept self signed ssl certificates
process.env.NODE_ENV = 'testing'; //Disable all logging in app

//Start app
global.app = require(path.join(__dirname, '../app.js'));
const mongo = require(path.join(__dirname, '../app/mongo.js'));

//Wait for database connection
beforeAll(function(callback){
	mongo.connection.on('open', function(){
		callback();
	});
});

//Stop app
afterAll(function(callback){
	global.app.shutdown(callback);
});