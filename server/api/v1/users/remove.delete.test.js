//Modules
const url = require('url');
const request = require('request');
const querystring = require('querystring');

//Includes
const config = require_config();

//Models
const User = require(__models + '/user.js');

//Request prototype
let startRequest = function(params, checks){
	request({
		url: url.resolve('http://' + config.http.url + ':' + config.http.port.internal, '/api/v1/users?') + querystring.stringify(params),
		method: 'DELETE',
		json: true
	}, function (err, res, body) {
		
		//Check there was no error in the request
		expect(err).toBeNull();
		expect(res.statusCode).toBe(200);
		
		//Perform coresponding test checks
		checks(body);
	});
};

describe('Delete User', function(){
	
	//! Positive Tests
	
	describe('Positive Tests', function(){
		
		it('should delete user', function(done){
			startRequest({
				userId: '607f1f77bcf86cd799439013',
			}, function(body){
				
				//Check that user was removed from database
				User.findById('607f1f77bcf86cd799439013', function(err, user){
					
					//Check user doesnt exist
					expect(user).toBe(null);
					
					done();
				});
			});
			
		});
		
	});
	
	//! Negative Tests
	
	describe('Negative Tests', function(){
		
		it('should return error if no user id is given', function(done){
			startRequest({}, function(body){
				
				//Check error was correct
				expect(body.error).toBe('User identifier must be given');
				
				done();
			});
			
		});
		
	});
	
});