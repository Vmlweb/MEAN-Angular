//Modules
const url = require('url');
const request = require('request');

//Includes
const config = require(__config);

//Models
const User = require(__models + '/user.js');

//Request prototype
let startRequest = function(params, checks){
	request({
		url: url.resolve('http://' + config.http.url + ':' + config.http.port.internal, '/api/v1/users'),
		method: 'PUT',
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

describe('Update Users', function(){
	
	//! Positive Tests
	
	describe('Positive Tests', function(){
		
		it('should update details for user', function(done){
			startRequest({
				userId: '607f1f77bcf86cd799439013',
				username: 'NewUsername',
				email: 'NewEmail@NewEmail.com'
			}, function(body){
				
				//Check that user was changed in database
				User.findById('607f1f77bcf86cd799439013', function(err, user){
					
					//Check user details
					expect(user.username).toBe('NewUsername');
					expect(user.email).toBe('NewEmail@NewEmail.com');
					
					done();
				});
			});
			
		});
		
	});
	
	//! Negative Tests
	
	describe('Negative Tests', function(){
		
		it('should return error if no user id is given', function(done){
			startRequest({
				username: 'NewUsername',
				email: 'NewEmail@NewEmail.com'
			}, function(body){
				
				//Username must be given
				expect(body.error).toBe('User identifier must be given');
				
				done();
			});
			
		});
		
	});
	
});