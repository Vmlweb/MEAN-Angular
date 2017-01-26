//Modules
import * as catcher from 'promise-catcher'
import { TestBed, async, inject } from '@angular/core/testing'
import { HttpModule } from '@angular/http'

//Includes
import { IUser, User } from './user.model'
import { UserService } from './user.service'

describe('Test 2', () => {
	
	//! Setup
	
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ HttpModule ],
			providers: [
				UserService
			]
		})
	})
	
	//! Positive Tests
	
	describe('Positive Tests', () => {
		
		/*it('create new user with details', catcher.jasmine(async done => {
			
			done()
		}))*/

		it('create new user with details', async(inject([UserService], (service: UserService) => {
			
			/*service.insert({
				username: 'test',
				email: 'test@test.com'
			})
			.then(user => {
				console.log(user)
			})
			.catch(err => {
				console.log(err)
			})*/
			
			//done()
		})))
		
	})
	
	//! Negative Tests
	
	describe('Negative Tests', () => {
		
		
	})
	
})