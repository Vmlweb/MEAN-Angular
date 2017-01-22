//Modules
import * as request from 'request-promise-native'
import * as catcher from 'promise-catcher'

//Includes
import { ErrorCode } from 'app'
import { User } from 'models'

describe('Update User', () => {
	
	//! Positive Tests
	
	describe('Positive Tests', () => {
		
		it('update user with details', catcher.jasmine(async done => {
			
			//Make request with body
			const response = await request.put(process.env.URL + '/api/v1/users/607f1f77bcf86cd799439013', {
				json: true,
				body: {
					username: 'NewUsername',
					email: 'NewEmail@NewEmail.com'
				}
			})
			
			//Check response output
			expect(response.error).not.toBeDefined()
			
			//Check correct details were created
			const user = await User.findById('607f1f77bcf86cd799439013')
			expect(user.username).toBe('NewUsername')
			expect(user.email).toBe('NewEmail@NewEmail.com')
			
			done()
		}))
		
	})
	
	//! Negative Tests
	
	describe('Negative Tests', () => {
		
		it('error USR_Invalid if invaid user id is specified', catcher.jasmine(async done => {
			
			//Make request with body
			const response = await request.put(process.env.URL + '/api/v1/users/UserId', {
				json: true,
				body: {
					username: 'NewUsername',
					email: 'NewEmail@NewEmail.com'
				}
			})
			
			//Check response output
			expect(response.error).toBe(ErrorCode.USR_Invalid)
			
			done()
		}))
		
		it('error USR_InvalidUsername if no username is specified', catcher.jasmine(async done => {
			
			//Make request with body
			const response = await request.post(process.env.URL + '/api/v1/users', {
				json: true,
				body: {
					email: 'NewEmail@NewEmail.com'
				}
			})
			
			//Check response output
			expect(response.error).toBe(ErrorCode.USR_InvalidUsername)
			
			done()
		}))
		
		it('error USR_InvalidEmail if no e-mail address is specified', catcher.jasmine(async done => {
			
			//Make request with body
			const response = await request.post(process.env.URL + '/api/v1/users', {
				json: true,
				body: {
					username: 'NewUsername'
				}
			})
			
			//Check response output
			expect(response.error).toBe(ErrorCode.USR_InvalidEmail)
			
			done()
		}))
		
		it('error USR_InvalidEmail if invalid e-mail address is specified', catcher.jasmine(async done => {
			
			//Make request with body
			const response = await request.post(process.env.URL + '/api/v1/users', {
				json: true,
				body: {
					username: 'NewUsername',
					email: 'InvalidEmail'
				}
			})
			
			//Check response output
			expect(response.error).toBe(ErrorCode.USR_InvalidEmail)
			
			done()
		}))
		
		it('error USR_NotFound if non existant user id is specified', catcher.jasmine(async done => {
			
			//Make request with body
			const response = await request.put(process.env.URL + '/api/v1/users/107f1f77bcf86cd799439013', {
				json: true,
				body: {
					username: 'NewUsername',
					email: 'NewEmail@NewEmail.com'
				}
			})
			
			//Check response output
			expect(response.error).toBe(ErrorCode.USR_NotFound)
			
			done()
		}))
		
	})
	
})