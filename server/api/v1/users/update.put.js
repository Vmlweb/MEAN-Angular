//Modules
var validator = require("validator");
var async = require("async");
var router = require("express").Router();

//Models
var User = require(__models + "/user.js");

router.put("/v1/users", function (req, res, next){	
	
	//Check for all required parameters
	var userId = req.body.userId || null;
	var username = req.body.username || null;
	var email = req.body.email || null;
	
	//Validate parameter fields
	if (userId === "" || userId === null){ return next("User identifier must be given"); } 
	if (username === "" || username === null){ return next("Username must be given"); }
	if (email === "" || email === null){ return next("E-mail address must be given"); }
	
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