//Modules
var router = require('express').Router();

//Models
var User = require(__models + '/user.js');

router.delete('/v1/users', function (req, res, next){	
	
	//Check for all required parameters
	var userId = req.query.userId || null;
	
	//Validate parameter fields
	if (userId === '' || userId === null){ return next('User identifier must be given'); } 
	
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