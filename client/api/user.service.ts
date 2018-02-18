//Modules
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

//Includes
import { IUserAction, User } from './user.model'

@Injectable()
export class UserService {
	
	constructor(private http: HttpClient){}
	
	async list(limit: number = -1){
		
		//Perform http request
		const response: any = await this.http.get(process.env.URL + '/api/v1/users?' + (limit > 0 ? 'limit=' + limit : '')).toPromise()
		
		//Check json for error
		if (response.error){
			throw response.error
		}
		
		//Parse and return users
		return response.users.map(user => new User(user))
	}
	
	async insert(options: IUserAction){
		
		//Perform http request
		const response: any = await this.http.post(process.env.URL + '/api/v1/users', options).toPromise()
		
		//Check json for error
		if (response.error){
			throw response.error
		}
		
		//Return user object
		return new User({
			userId: response.userId,
			username: options.username,
			email: options.email
		})
	}
	
	async update(user: User, options: IUserAction){
		
		//Perform http request
		const response: any = await this.http.put(process.env.URL + '/api/v1/users/' + user.userId, options).toPromise()
		
		//Check json for error
		if (response.error){
			throw response.error
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
		const response: any = await this.http.delete(process.env.URL + '/api/v1/users/' + user.userId).toPromise()
		
		//Check json for error
		if (response.error){
			throw response.error
		}
	}
}