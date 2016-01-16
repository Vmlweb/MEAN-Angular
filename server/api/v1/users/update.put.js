//Modules
var validator = require("validator");
var async = require("async");
var router = require("express").Router();

//Includes
var Helper = require(__helper);

//Models
var User = require(__models + "/user.js");

router.put("/v1/users", function (req, res, next){	
	
	//Check for all required parameters
	var userId = Helper.loadParam(req.body, "userId", "");
	var username = Helper.loadParam(req.body, "username", "");
	var email = Helper.loadParam(req.body, "email", "");
	
	//Strip whitespace and new lines
	userId = Helper.trim(userId);
	username = Helper.trim(username);
	email = Helper.trim(email);
	
	//Validate parameter fields
	if (userId === ""){ return next("User identifier must be given"); } 
	if (username === ""){ return next("Username must be given"); }
	if (email === ""){ return next("E-mail address must be given"); }
	
	//Start async operations	
	async.waterfall([
		function (done){
			
			//Find user in database
			User.findById(userId, function (err, user){
				if (user){
					done(null, user);
				}else{
					done(err);
				}
			});
			
		}, function (user, done){
			
			//Update user details
			user.username = username;
			user.email = email;
			
			//Save changes to database
			user.save(function(err){
				if (err){
					done(err);
				}else{
					done(null);
				}
			});
			
		}
	], function (err){
		if (err){
			next(err);
		}else{
			
			//Send success response
			res.json({});
			
		}
	});
});

module.exports = router;