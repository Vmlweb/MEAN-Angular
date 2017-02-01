//Modules
import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'

//Includes
import { ErrorCode } from 'shared'
import { IUserAction, User } from './user.model'

@Injectable()
export class UserService {
	
	constructor(private http: Http){}
	
	async list(limit: number = -1){
		
		//Perform http request
		const response = await this.http.get(process.env.URL + '/api/v1/users?' + (limit > 0 ? 'limit=' + limit : '')).toPromise()
		
		//Check json for error
		const json = response.json()
		if (json.error){
			throw json.error
		}
		
		//Parse and return users
		return json.users.map(user => new User(user))
	}
	
	async insert(options: IUserAction){
		
		//Perform http request
		const response = await this.http.post(process.env.URL + '/api/v1/users', JSON.stringify(options), {
			headers: new Headers({ 'Content-Type': 'application/json' })
		}).toPromise()
		
		//Check json for error
		const json = response.json()
		if (json.error){
			throw json.error
		}
		
		//Return user object
		return new User({
			userId: json.userId,
			username: options.username,
			email: options.email
		})
	}
	
	async update(user: User, options: IUserAction){
		
		//Perform http request
		const response = await this.http.put(process.env.URL + '/api/v1/users/' + user.userId, JSON.stringify(options), {
			headers: new Headers({ 'Content-Type': 'application/json' })
		}).toPromise()
		
		//Check json for error
		const json = response.json()
		if (json.error){
			throw json.error
		}
		
		//Return user object
		return new User({
			userId: user.userId,
			username: options.username,
			email: options.email
		})
	}
	
	async remove(user: User){
		
		//Perform http request
		const response = await this.http.delete(process.env.URL + '/api/v1/users/' + user.userId).toPromise()
		
		//Check json for error
		const json = response.json()
		if (json.error){
			throw json.error
		}
	}
}