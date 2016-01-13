//Modules
import {Observable} from "rxjs/Observable";
import {Injectable} from "angular2/core";
import {Http, Headers, RequestOptions, Request, RequestMethod} from "angular2/http";

//Includes
import {User} from './user.model';

@Injectable()
export class Users{
	
	//Constructor
	constructor(private http: Http){
		this.http = http;
	}
	
	//Create new user
	insertUser(username: string, email: string){
		
		//Prepare headers
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		
		//Make http post request
		var request = this.http.request(new Request(new RequestOptions({
			headers: headers,
			method: RequestMethod.Post,
			url: "/api/v1/users/insert?username=Test",
			body: JSON.stringify({ username: username, email: email })
		})));
		
		//Parse json response
		return request.map(res => res.json());
	}
	
	//Get existing users
	getUsers(limit: Number): Observable<User[]>{
		
		//Make http get request
		var request = this.http.request(new Request(new RequestOptions({
			method: RequestMethod.Get,
			url: "/api/v1/users?limit=" + limit.toString()
		})));
		
		//Parse json response
		return request
			.map(res => res.json())
			.map(res => res.users.map(u => new User(u.userId, u.username, u.email)));
	}
	
	//Delete user with id
	deleteUser(userId: string){
		
		//Make http delete request
		var request = this.http.request(new Request(new RequestOptions({
			method: RequestMethod.Delete,
			url: "/api/v1/users/delete?userId=" + userId
		})));
		
		//Parse json response
		return request.map(res => res.json());
	}
}