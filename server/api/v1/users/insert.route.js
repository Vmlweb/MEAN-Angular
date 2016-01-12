//Modules
var validator = require("validator");
var async = require("async");
var router = require("express").Router();

//Includes
var Helper = require("../../../app/helper.js");
var User = require("../../../models/user.js");

//Request
router.post("/v1/users/insert", function (req, res, next){	
	
	//Check for all required parameters
	var username = Helper.loadParam(req.body, "username", "");
	var email = Helper.loadParam(req.body, "email", "");
	
	//Strip whitespace and new lines
	username = Helper.trim(username);
	email = Helper.trim(email);
	
	//Validate parameter fields
	if (username === ""){ return next("Username must be given"); }
	if (email === ""){ return next("E-mail address must be given"); }
	
	//Start async operations	
	async.waterfall([
		function (done){
			
			//Update user details
			var user = new User();
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