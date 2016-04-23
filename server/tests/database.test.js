//Modules
var path = require("path");
var async = require("async");

//Includes
var Mongo = require(__app + "/mongo.js");

//Models
var User = require(__models + "/user.js");

//Data
var users = require(path.join(__dirname, "users.test.json"));

//Wait for database connection
beforeAll((callback) => {
	Mongo.connection.on('open', () => {
		callback();
	});
});
	
//Clear and repopulate database
beforeEach((callback) => {
	async.parallel([
	    (done) => {
		    
		    //Populate users table
			Mongo.connection.db.dropCollection("users", (err, result) => {
				User.insertMany(users, (err) => {
					done(err);
				});
			});
		}
    ], (err) => {
	    callback(err);
    });
});