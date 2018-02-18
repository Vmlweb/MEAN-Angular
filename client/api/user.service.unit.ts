//Modules
import * as catcher from 'promise-catcher'
import * as request from 'request-promise-native'
import { TestBed, async, inject } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'

//Includes
import { ErrorCode } from 'shared'
import { UserService } from './user.service'

describe('User Service', () => {
	
	//! Setup
	
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ HttpClientModule ],
			providers: [ UserService ]
		})
	})
	
	beforeEach(async done => {
		await request.delete(process.env.URL + '/api')
		done()
	})
	
	//! Positive Tests
	
	describe('Positive Tests', () => {

		it('list all users when limit not specified', async(inject([UserService], catcher.angular(async (service: UserService) => {
			
			//List all users
			const users = await service.list()
			
			//Check correct details were created
			expect(users.length).toBe(5)
			
			expect(users[0].userId).toBe('607f1f77bcf86cd799439011')
			expect(users[0].username).toBe('FirstUser')
			expect(users[0].email).toBe('FirstUser@FirstUser.com')
			
			expect(users[1].userId).toBe('607f1f77bcf86cd799439012')
			expect(users[1].username).toBe('SecondUser')
			expect(users[1].email).toBe('SecondUser@SecondUser.com')
			
			expect(users[2].userId).toBe('607f1f77bcf86cd799439013')
			expect(users[2].username).toBe('ThirdUser')
			expect(users[2].email).toBe('ThirdUser@ThirdUser.com')
			
			expect(users[3].userId).toBe('607f1f77bcf86cd799439014')
			expect(users[3].username).toBe('FourthUser')
			expect(users[3].email).toBe('FourthUser@FourthUser.com')
			
			expect(users[4].userId).toBe('607f1f77bcf86cd799439015')
			expect(users[4].username).toBe('FifthUser')
			expect(users[4].email).toBe('FifthUser@FifthUser.com')
			
		}))))
		
		it('list one user when limit of 1', async(inject([UserService], catcher.angular(async (service: UserService) => {
			
			//List 1 user
			const users = await service.list(1)
			
			//Check correct details were created
			expect(users.length).toBe(1)
			
			expect(users[0].userId).toBe('607f1f77bcf86cd799439011')
			expect(users[0].username).toBe('FirstUser')
			expect(users[0].email).toBe('FirstUser@FirstUser.com')
			
		}))))

		it('list three users when limit of 3', async(inject([UserService], catcher.angular(async (service: UserService) => {
			
			//List 3 users
			const users = await service.list(3)
			
			//Check correct details were created
			expect(users.length).toBe(3)
			
			expect(users[0].userId).toBe('607f1f77bcf86cd799439011')
			expect(users[0].username).toBe('FirstUser')
			expect(users[0].email).toBe('FirstUser@FirstUser.com')
			
			expect(users[1].userId).toBe('607f1f77bcf86cd799439012')
			expect(users[1].username).toBe('SecondUser')
			expect(users[1].email).toBe('SecondUser@SecondUser.com')
			
			expect(users[2].userId).toBe('607f1f77bcf86cd799439013')
			expect(users[2].username).toBe('ThirdUser')
			expect(users[2].email).toBe('ThirdUser@ThirdUser.com')
			
		}))))

		it('create new user with details, then update and remove', async(inject([UserService], catcher.angular(async (service: UserService) => {
			
			//Create new user
			let user = await service.insert({
				username: 'NewUsername',
				email: 'NewEmail@NewEmail.com'
			})
			
			//Check correct details were created
			expect(user.userId).toBeDefined()
			expect(user.username).toBe('NewUsername')
			expect(user.email).toBe('NewEmail@NewEmail.com')
			
			//Check correct user was created
			let users = await service.list()
			expect(users.length).toBe(6)
			expect(users[5].userId).toBe(user.userId)
			expect(users[5].username).toBe('NewUsername')
			expect(users[5].email).toBe('NewEmail@NewEmail.com')
			
			//Update user
			user = await service.update(user, {
				username: 'UpdatedUsername',
				email: 'UpdateEmail@UpdateEmail.com'
			})
			
			//Check correct user was updated
			users = await service.list()
			expect(users.length).toBe(6)
			expect(users[5].userId).toBe(user.userId)
			expect(users[5].username).toBe('UpdatedUsername')
			expect(users[5].email).toBe('UpdateEmail@UpdateEmail.com')
			
			//Remove user
			await service.remove(user)
			
			//Check correct user was updated
			users = await service.list()
			expect(users.length).toBe(5)
			
		}))))
		
	})
	
	//! Negative Tests
	
	describe('Negative Tests', () => {
		
		it('error USR_InvalidUsername if no username is specified', async(inject([UserService], catcher.angular(async (service: UserService) => {
			try{
				
				//Create new user
				const user = await service.insert({
					username: '',
					email: 'NewEmail@NewEmail.com'
				})
				
				//Check no user was returned
				expect(user).not.toBeDefined()
				
			}catch(err){
				
				//Check returned error
				expect(err).toBe(ErrorCode.USR_InvalidUsername)
			
			}
		}))))
		
		it('error USR_InvalidEmail if no e-mail address is specified', async(inject([UserService], catcher.angular(async (service: UserService) => {
			try{
				
				//Create new user
				const user = await service.insert({
					username: 'NewUsername',
					email: ''
				})
				
				//Check no user was returned
				expect(user).not.toBeDefined()
				
			}catch(err){
				
				//Check returned error
				expect(err).toBe(ErrorCode.USR_InvalidEmail)
			
			}
		}))))
		
		it('error USR_InvalidEmail if invalid e-mail address is specified', async(inject([UserService], catcher.angular(async (service: UserService) => {
			try{
				
				//Create new user
				const user = await service.insert({
					username: 'NewUsername',
					email: 'InvalidEmail'
				})
				
				//Check no user was returned
				expect(user).not.toBeDefined()
				
			}catch(err){
				
				//Check returned error
				expect(err).toBe(ErrorCode.USR_InvalidEmail)
			
			}
		}))))
		
	})
	
})