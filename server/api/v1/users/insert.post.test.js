//Modules
var url = require("url");
var request = require("request");

//Includes
var Config = require(__config);

//Models
var User = require(__models + "/user.js");

//Request prototype
var startRequest = function(params, checks){
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

describe("Insert Users", function(){
	
	// !Positive Tests
	
	describe("Positive Tests", function(){
		
		it("should insert details for user", function(done){
			startRequest({
				username: "NewUsername",
				email: "NewEmail@NewEmail.com"
			}, function(body){
				
				//Check that user was inserted to database
				User.find({ username: "NewUsername", email: "NewEmail@NewEmail.com" }, function(err){
					done();
				});
			});
			
		});
		
	});
	
	// !Negative Tests
	
	describe("Negative Tests", function(){
		
		it("should return error if no username is given", function(done){
			startRequest({
				email: "NewEmail@NewEmail.com"
			}, function(body){
				
				//Check error was correct
				expect(body.error).toBe("Username must be given");
				
				done();
			});
			
		});
		
	});
	
});