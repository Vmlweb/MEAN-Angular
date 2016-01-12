//Modules
var validator = require("validator");
var async = require("async");
var router = require("express").Router();

//Includes
var Helper = require("../../../app/helper.js");
var User = require("../../../models/user.js");

//Request
router.delete("/v1/users/delete", function (req, res, next){	
	
	//Check for all required parameters
	var userId = Helper.loadParam(req.body, "userId", "");
	
	//Strip whitespace and new lines
	userId = Helper.trim(userId);
	
	//Validate parameter fields
	if (userId === ""){ return next("User identifier must be given"); } 
	
	//Find user in database
	User.findById(userId).remove(function (err, user){
		if (user){
			
			//Send response
			res.json({});
			
		}else{
			return next(err);
		}
	});
});

module.exports = router;