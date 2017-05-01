//Modules
import * as request from 'request-promise-native'
import * as catcher from 'promise-catcher'

//Includes
import { ErrorCode } from 'shared'
import { User } from 'models'

describe('Delete User', () => {
	
	//! Positive Tests
	
	describe('Positive Tests', () => {
		
		it('delete user with identifier', catcher.jasmine(async done => {
			
			//Make request and check output
			const response = await request.delete(process.env.URL + '/v1/users/607f1f77bcf86cd799439013', { json: true })
			expect(response.error).not.toBeDefined()
			
			//Check correct details were created
			const user = await User.findById('607f1f77bcf86cd799439013')
			expect(user).toBeNull()
			
			done()
		}))
		
	})
	
	//! Negative Tests
	
	describe('Negative Tests', () => {
		
		it('error USR_Invalid if invaid user id is specified', catcher.jasmine(async done => {
			
			//Make request and check error code
			const response = await request.delete(process.env.URL + '/v1/users/UserId', { json: true })
			expect(response.error).toBe(ErrorCode.USR_Invalid)
			
			done()
		}))
		
		it('error USR_NotFound if non existant user id is specified', catcher.jasmine(async done => {
			
			//Make request and check error code
			const response = await request.delete(process.env.URL + '/v1/users/107f1f77bcf86cd799439013', { json: true })
			expect(response.error).toBe(ErrorCode.USR_NotFound)
			
			done()
		}))
		
	})
	
})