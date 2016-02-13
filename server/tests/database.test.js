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
beforeAll(function(callback){
	Mongo.connection.on('open', function(){
		callback();
	});
});
	
//Clear and repopulate database
beforeEach(function(callback){
	async.parallel([
	    function (done){
		    
		    //Populate users table
			Mongo.connection.db.dropCollection("users", function(err, result){
				User.insertMany(users, function(err){
					done(err);
				});
			});
		}
    ], function(err){
	    callback(err);
    });
});