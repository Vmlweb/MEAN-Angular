//Modules
import { Injectable } from '@angular/core'
import { Http, Headers, Response } from '@angular/http'

//Includes
import { IUser, User } from './user.model'

@Injectable()
export class UserService {
	
	constructor(private http: Http){}
	
	async insert(username: string, email: string){
		let headers = new Headers({ 'Content-Type': 'application/json' })
		
		let response = await this.http.post('/api/v1/users', JSON.stringify({
			username, email
		}), {headers: headers}).toPromise()
		
		if (response.json().error){
			throw new Error(response.json().error)
		}
		
		return new User({ userId: response.json().userId, username, email })
	}
	
	async list(){
		
		let response = await this.http.get('/api/v1/users').toPromise()
		response = response.json().users.map(user => new User(user))
		return response
		//console.log(response)
	}
}