//Modules
var url = require("url");
var request = require("request");

//Includes
var Config = require(__config);

//Models
var User = require(__models + "/user.js");

//Request prototype
var startRequest = (params, checks) => {
	request({
		url: url.resolve("http://" + Config.http.url + ":" + Config.http.port.internal, "/api/v1/users"),
		method: "PUT",
		json: true,
		body: params
	}, function (err, res, body) {
		
		//Check there was no error in the request
		expect(err).toBeNull();
		expect(res.statusCode).toBe(200);
		
		//Perform coresponding test checks
		checks(body);
	});
};

describe("Update Users", () => {
	
	//! Positive Tests
	
	describe("Positive Tests", () => {
		
		it("should update details for user", (done) => {
			startRequest({
				userId: "607f1f77bcf86cd799439013",
				username: "NewUsername",
				email: "NewEmail@NewEmail.com"
			}, (body) => {
				
				//Check that user was changed in database
				User.findById("607f1f77bcf86cd799439013", (err, user) => {
					
					//Check user details
					expect(user.username).toBe("NewUsername");
					expect(user.email).toBe("NewEmail@NewEmail.com");
					
					done();
				});
			});
			
		});
		
	});
	
	//! Negative Tests
	
	describe("Negative Tests", () => {
		
		it("should return error if no user id is given", (done) => {
			startRequest({
				username: "NewUsername",
				email: "NewEmail@NewEmail.com"
			}, (body) => {
				
				//Username must be given
				expect(body.error).toBe("User identifier must be given");
				
				done();
			});
			
		});
		
	});
	
});