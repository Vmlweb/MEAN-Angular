//Modules
const router = require('express').Router();

//Models
const User = require(__models + '/user.js');

router.get('/v1/users', function (req, res, next){	
	
	//Check for all required parameters
	let limit = req.query.limit ? parseInt(req.query.limit) : -1;
	
	//Validate parameter fields
	if (limit < 0){ return next('Limit must be an integer'); } 
	
	//Find all users in the database
	User.find().sort({'_id': 1}).limit(limit).exec(function (err, users){
		if (err){
			return next(err);
		}else{
		
			//Compile list of response users
			let responseUsers = [];
			for (let i=0; i<users.length; i++){
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