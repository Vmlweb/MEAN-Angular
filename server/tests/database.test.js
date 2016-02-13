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
	
//Populate test data
beforeEach(function(callback){
	async.waterfall([
		function (done){	    
		    async.parallel([
				function (cleared){
					Mongo.connection.db.dropCollection("users", function(err, result){
						cleared();
					});
				}
			], function(){
				done();
			});
		},
	    function (done) {		    
		    async.parallel([
			    function (inserted){
				    
				    //Populate users table
					User.insertMany(users, function(err){
						inserted(err);
					});
				    
			    }
		    ], function(err){
			    done(err);
		    });
	    }
	], function(err){
		callback(err);
	});
});