//Modules
import {Observable} from "rxjs/Observable";
import {Injectable} from "angular2/core";
import {Http, Headers, Request, RequestOptions, RequestMethod, URLSearchParams} from "angular2/http";

//Includes
import {User} from './user.model';

@Injectable()
export class UserService{
	
	constructor(private http: Http){
		this.http = http;
	}
	
	//Get list of existing users
	getUsers(limit: Number): Observable<User[]>{
		
		//Setup url parameters
		let params = new URLSearchParams();
		params.set("limit", limit.toString());
		
		//Make http get request
		var request = this.http.request(new Request(new RequestOptions({
			method: RequestMethod.Get,
			url: "/api/v1/users",
			search: params
		})));
		
		//Parse json response and map to object
		return request
			.map(res => res.json())
			.map(res => {
				
				//Check response for errors
				if (res.hasOwnProperty('error')){
					alert(res.error);
					throw new Error(res.error);
				}else{
					return res.users;
				}
			})
			.map(res => res.map(u => new User(u.userId, u.username, u.email)));
	}
	
	//Create new user in backend
	insertUser(username: string, email: string){
		
		//Make http post request
		var request = this.http.request(new Request(new RequestOptions({
			headers: new Headers({
				"Content-Type": "application/json"
			}),
			method: RequestMethod.Post,
			url: "/api/v1/users2",
			body: JSON.stringify({
				username: username,
				email: email
			})
		})));
		
		//Parse json response
		return request
			.map(res => res.json())
			.map(res => {
				
				//Check response for errors
				if (res.hasOwnProperty('error')){
					throw new Error(res.error);
				}else{
					return res;
				}
			});
	}
	
	//Delete user from backend with identifier
	deleteUser(userId: string){
		
		//Setup url parameters
		let params = new URLSearchParams();
		params.set("userId", userId);
		
		//Make http delete request
		var request = this.http.request(new Request(new RequestOptions({
			method: RequestMethod.Delete,
			url: "/api/v1/users",
			search: params
		})));
		
		//Parse json response
		return request
			.map(res => res.json())
			.map(res => {
				
				//Check response for errors
				if (res.hasOwnProperty('error')){
					throw new Error(res.error);
				}else{
					return res;
				}
			});
	}
}