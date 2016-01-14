//Modules
var url = require("url");
var request = require("request");

//Includes
var Config = require("../../../config.js");

//Request prototype
var startRequest = function(params, checks){
	request({
		url: url.resolve("http://" + Config.http.url + ":" + Config.http.port.external, "/api/v1/time"),
		method: "GET",
		json: true,
		body: params
	}, function (err, res, body) {
		
		//Check there was no error in the request
		expect(res.statusCode).toBe(200);
		expect(err).toBe(null);
		
		//Perform coresponding test checks
		checks(body);
	});
};

describe("Time", function(){
	
	// !Positive Tests
	
	describe("Positive Tests", function(){
		
		it("should return stub time", function(done){
			startRequest({}, function(body){
				
				//Check that time matches mock objects time
				expect(body.time).toBe("Sunday, December 12th 2012, 12:12:12 am");
				
				done();
			});
			
		});
		
	});
	
});