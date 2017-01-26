//Modules
import { Injectable } from '@angular/core'
import { Http, Headers, Response } from '@angular/http'

//Includes
import { ICreateUser, IUser, User } from './user.model'

@Injectable()
export class UserService {
	
	constructor(private http: Http){}
	
	async insert(options: ICreateUser){
		let headers = new Headers({ 'Content-Type': 'application/json' })
		
		let response = await this.http.post('http://localhost:8080/api/v1/users', JSON.stringify({
			username: options.username,
			email: options.email
		}), {headers: headers}).toPromise()
		
		if (response.json().error){
			throw new Error(response.json().error)
		}
		
		return new User({
			userId: response.json().userId,
			username: options.username,
			email: options.email
		})
	}
	
	async list(){
		
		let response = await this.http.get('/api/v1/users').toPromise()
		response = response.json().users.map(user => new User(user))
		return response
		//console.log(response)
	}
}