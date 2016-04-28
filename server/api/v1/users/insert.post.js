//Modules
var async = require("async");
var router = require("express").Router();

//Models
var User = require(__models + "/user.js");

router.post("/v1/users", function (req, res, next){	
	
	//Parse body
	var username = req.body.username || null;
	var email = req.body.email || null;
	
	//Validate parameter fields
	if (username === "" || username === null){ return next("Username must be given"); }
	if (email === "" || email === null){ return next("E-mail address must be given"); }
	
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