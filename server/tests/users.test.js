//Includes
var User = require("../models/user.js");
var Helper = require("../app/helper.js");

//Setup
beforeEach(function(callback){
	
	//Reset the database
	User.remove(function(){
		var objects = [];
		
		//Add new users to database
		objects.push(User({ _id: "607f1f77bcf86cd799439011", username: "FirstUser", email: "FirstUser@FirstUser.com"}));
		objects.push(User({ _id: "607f1f77bcf86cd799439012", username: "SecondUser", email: "SecondUser@SecondUser.com"}));
		objects.push(User({ _id: "607f1f77bcf86cd799439013", username: "ThirdUser", email: "ThirdUser@ThirdUser.com"}));
		objects.push(User({ _id: "607f1f77bcf86cd799439014", username: "FourthUser", email: "FourthUser@FourthUser.com"}));
		objects.push(User({ _id: "607f1f77bcf86cd799439015", username: "FifthUser", email: "FifthUser@FifthUser.com"}));
		
		//Save all users to database
		Helper.saveAll(objects, function(err){
			if (err){
				callback(err);
			}else{
				callback();
			}
		});
	});
});