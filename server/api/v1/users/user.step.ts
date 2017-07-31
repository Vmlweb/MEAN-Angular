//Modules
import { defineSupportCode } from 'cucumber'
import { expect } from 'xolvio-jasmine-expect'

//Includes
import * as userList from './user.ep'
import * as userInsert from './insert.ep'

defineSupportCode(({ Given, Then, When }) => {
	
	//! Listing Users
	
	When('listing users', async () => {
		
		//Execute listing users endpoint
		await (userList.endpoint.execute as any)({ query: {} }, {
			json: (val) => {
				this.users = val.users
			}
		}, {})
	})
	
	Then('return {int} users', async (users) => {
		
		//Check correct number of users were returned
		expect(this.users.length).toBe(users)
	})
	
	Then('return user {string} with {string} of {string}', async (userId, key, value) => {
		
		//Loop through and find user
		let user
		for (const usr of this.users){
			if (usr.userId === userId){
				user = usr
			}
		}
		
		//Check user was found and matches criteria
		expect(user).toBeDefined()
		expect(user[key]).toBe(value)
	})
	
	//! Inserting User
	
	Given('username {string} and email {string}', async (username, email) => {
		this.username = username
		this.email = email
	})
	
	When('insert user', async () => {
		
		//Execute insert user endpoint
		await (userInsert.endpoint.execute as any)({
			body: {
				username: this.username,
				email: this.email
			}
		}, {
			json: (val) => {
				this.userId = val.userId
			}
		}, {})
	})
	
	Then('return identifier', async () => {
		expect(this.userId).toBeDefined()
	})
})