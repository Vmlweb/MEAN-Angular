//Modules
import * as request from 'request-promise-native'
import * as catcher from 'promise-catcher'

//Includes
import { ErrorCode } from 'shared'

describe('List Users', () => {
	
	//! Positive Tests
	
	describe('Positive Tests', () => {
		
		it('list all users when limit not specified', catcher.jasmine(async done => {
			
			//Make request and check output
			const response = await request.get(process.env.URL + '/v1/users', { json: true })
			expect(response.error).not.toBeDefined()
			
			//Check correct details were created
			expect(response.users.length).toBe(5)
			
			expect(response.users[0].userId).toBe('607f1f77bcf86cd799439011')
			expect(response.users[0].username).toBe('FirstUser')
			expect(response.users[0].email).toBe('FirstUser@FirstUser.com')
			
			expect(response.users[1].userId).toBe('607f1f77bcf86cd799439012')
			expect(response.users[1].username).toBe('SecondUser')
			expect(response.users[1].email).toBe('SecondUser@SecondUser.com')
			
			expect(response.users[2].userId).toBe('607f1f77bcf86cd799439013')
			expect(response.users[2].username).toBe('ThirdUser')
			expect(response.users[2].email).toBe('ThirdUser@ThirdUser.com')
			
			expect(response.users[3].userId).toBe('607f1f77bcf86cd799439014')
			expect(response.users[3].username).toBe('FourthUser')
			expect(response.users[3].email).toBe('FourthUser@FourthUser.com')
			
			expect(response.users[4].userId).toBe('607f1f77bcf86cd799439015')
			expect(response.users[4].username).toBe('FifthUser')
			expect(response.users[4].email).toBe('FifthUser@FifthUser.com')
			
			done()
		}))
		
		it('list one user when limit of 1', catcher.jasmine(async done => {
			
			//Make request and check output
			const response = await request.get(process.env.URL + '/v1/users?limit=1', { json: true })
			expect(response.error).not.toBeDefined()
			
			//Check correct details were created
			expect(response.users.length).toBe(1)
			expect(response.users[0].userId).toBe('607f1f77bcf86cd799439011')
			expect(response.users[0].username).toBe('FirstUser')
			expect(response.users[0].email).toBe('FirstUser@FirstUser.com')
			
			done()
		}))
		
		it('list three users when limit of 3', catcher.jasmine(async done => {
			
			//Make request and check output
			const response = await request.get(process.env.URL + '/v1/users?limit=3', { json: true })
			expect(response.error).not.toBeDefined()
			
			//Check correct details were created
			expect(response.users.length).toBe(3)
			
			expect(response.users[0].userId).toBe('607f1f77bcf86cd799439011')
			expect(response.users[0].username).toBe('FirstUser')
			expect(response.users[0].email).toBe('FirstUser@FirstUser.com')
			
			expect(response.users[1].userId).toBe('607f1f77bcf86cd799439012')
			expect(response.users[1].username).toBe('SecondUser')
			expect(response.users[1].email).toBe('SecondUser@SecondUser.com')
			
			expect(response.users[2].userId).toBe('607f1f77bcf86cd799439013')
			expect(response.users[2].username).toBe('ThirdUser')
			expect(response.users[2].email).toBe('ThirdUser@ThirdUser.com')
			
			done()
		}))
		
	})
	
	//! Negative Tests
	
	describe('Negative Tests', () => {
		
		it('error USR_InvalidLimit if invalid limit is specified', catcher.jasmine(async done => {
			
			//Make request and check output
			const response = await request.get(process.env.URL + '/v1/users?limit=hello', { json: true })
			expect(response.error).toBe(ErrorCode.USR_InvalidLimit)
			
			done()
		}))
		
	})
	
})