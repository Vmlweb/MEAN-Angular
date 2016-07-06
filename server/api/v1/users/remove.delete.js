//Modules
const router = require('express').Router();

//Models
const User = require(__models + '/user.js');

router.delete('/v1/users', function (req, res, next){	
	
	//Check for all required parameters
	let userId = req.query.userId || null;
	
	//Validate parameter fields
	if (userId === '' || userId === null){ return next('User identifier must be given'); } 
	
	//Find user in database
	User.findById(userId).exec(function(err, user){
		user.remove(function (err, user){
			if (user){
				
				//Send response
				res.json({});
				
			}else{
				return next(err);
			}
		});
	});
});

module.exports = router;