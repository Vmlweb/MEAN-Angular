//Modules
var url = require("url");
var request = require("request");
var querystring = require("querystring");

//Includes
var Config = require("../../../../config.js");
var User = require("../../../models/user.js");

//Request prototype
var startRequest = function(params, checks){
	request({
		url: url.resolve("http://" + Config.http.url + ":" + Config.http.port.internal, "/api/v1/users/delete?") + querystring.stringify(params),
		method: "DELETE",
		json: true
	}, function (err, res, body) {
		
		//Check there was no error in the request
		expect(res.statusCode).toBe(200);
		expect(err).toBe(null);
		
		//Perform coresponding test checks
		checks(body);
	});
};

describe("Delete User", function(){
	
	// !Positive Tests
	
	describe("Positive Tests", function(){
		
		it("should delete user", function(done){
			startRequest({
				userId: "607f1f77bcf86cd799439013",
			}, function(body){
				
				//Check that user was removed from database
				User.findById("607f1f77bcf86cd799439013", function(err, user){
					
					//Check user doesnt exist
					expect(user).toBe(null);
					
					done();
				});
			});
			
		});
		
	});
	
	// !Negative Tests
	
	describe("Negative Tests", function(){
		
		it("should return error if no user id is given", function(done){
			startRequest({}, function(body){
				
				//Check error was correct
				expect(body.error).toBe("User identifier must be given");
				
				done();
			});
			
		});
		
	});
	
});