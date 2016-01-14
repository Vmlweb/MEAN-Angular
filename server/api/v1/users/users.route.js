//Modules
var validator = require("validator");
var async = require("async");
var router = require("express").Router();

//Includes
var Helper = require("../../../app/helper.js");
var User = require("../../../models/user.js");

router.get("/v1/users", function (req, res, next){	
	
	//Check for all required parameters
	var limit = Helper.loadParam(req.query, "limit", "");
	
	//Convert string to integer
	limit = validator.toInt(limit);
	
	//Validate parameter fields
	if (!validator.isInt(limit)){ return next("Limit must be an integer"); } 
	
	//Find all users in the database
	User.find().sort({"_id": 1}).limit(limit).exec(function (err, users){
		if (err){
			return next(err);
		}else{
		
			//Compile list of response users
			var responseUsers = [];
			for (var i=0; i<users.length; i++){
				responseUsers.push({
					userId: users[i].id.toString(),
					username: users[i].username,
					email: users[i].email
				});
			}
		
			//Send user array response
			res.json({ users: responseUsers });
		}
	});
});

module.exports = router;