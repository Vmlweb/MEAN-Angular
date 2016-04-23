//Modules
var url = require("url");
var request = require("request");
var querystring = require("querystring");

//Includes
var Config = require(__config);

//Models
var User = require(__models + "/user.js");

//Request prototype
var startRequest = (params, checks) => {
	request({
		url: url.resolve("http://" + Config.http.url + ":" + Config.http.port.internal, "/api/v1/users?") + querystring.stringify(params),
		method: "DELETE",
		json: true
	}, function (err, res, body) {
		
		//Check there was no error in the request
		expect(err).toBeNull();
		expect(res.statusCode).toBe(200);
		
		//Perform coresponding test checks
		checks(body);
	});
};

describe("Delete User", () => {
	
	//! Positive Tests
	
	describe("Positive Tests", () => {
		
		it("should delete user", (done) => {
			startRequest({
				userId: "607f1f77bcf86cd799439013",
			}, (body) => {
				
				//Check that user was removed from database
				User.findById("607f1f77bcf86cd799439013", (err, user) => {
					
					//Check user doesnt exist
					expect(user).toBe(null);
					
					done();
				});
			});
			
		});
		
	});
	
	//! Negative Tests
	
	describe("Negative Tests", () => {
		
		it("should return error if no user id is given", (done) => {
			startRequest({}, (body) => {
				
				//Check error was correct
				expect(body.error).toBe("User identifier must be given");
				
				done();
			});
			
		});
		
	});
	
});