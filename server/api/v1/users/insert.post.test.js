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
		method: "POST",
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

describe("Insert Users", () => {
	
	//! Positive Tests
	
	describe("Positive Tests", () => {
		
		it("should insert details for user", (done) => {
			startRequest({
				username: "NewUsername",
				email: "NewEmail@NewEmail.com"
			}, (body) => {
				
				//Check that user was inserted to database
				User.find({ username: "NewUsername", email: "NewEmail@NewEmail.com" }, (err) => {
					done();
				});
			});
			
		});
		
	});
	
	//! Negative Tests
	
	describe("Negative Tests", () => {
		
		it("should return error if no username is given", (done) => {
			startRequest({
				email: "NewEmail@NewEmail.com"
			}, (body) => {
				
				//Check error was correct
				expect(body.error).toBe("Username must be given");
				
				done();
			});
			
		});
		
	});
	
});