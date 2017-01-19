//Modules
const url = require('url');
const request = require('request');

//Includes
const config = require_config();

//Models
const User = require(__models + '/user.js');

//Request prototype
let startRequest = function(params, checks){
	request({
		url: url.resolve('http://' + config.http.url + ':' + config.http.port.internal, '/api/v1/users'),
		method: 'POST',
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

describe('Insert Users', function(){
	
	//! Positive Tests
	
	describe('Positive Tests', function(){
		
		it('should insert details for user', function(done){
			startRequest({
				username: 'NewUsername',
				email: 'NewEmail@NewEmail.com'
			}, function(body){
				
				//Check that user was inserted to database
				User.find({ username: 'NewUsername', email: 'NewEmail@NewEmail.com' }, function(err){
					done();
				});
			});
			
		});
		
	});
	
	//! Negative Tests
	
	describe('Negative Tests', function(){
		
		it('should return error if no username is given', function(done){
			startRequest({
				email: 'NewEmail@NewEmail.com'
			}, function(body){
				
				//Check error was correct
				expect(body.error).toBe('Username must be given');
				
				done();
			});
			
		});
		
	});
	
});