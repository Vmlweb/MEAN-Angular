import {Observable} from "rxjs/Observable";
import {Injectable} from "angular2/core";
import {Http, Headers, RequestOptions, Request, RequestMethod} from "angular2/http";

@Injectable()
export class Time{
	
	//Constructor
	constructor(private http: Http){
		this.http = http;
	}
	
	//Make request to backend to get time
	currentTime(){
		
		//Prepare headers
		let header = new Headers();
		header.append("Content-Type", "application/x-www-form-urlencoded");
		
		//Make http get request
		var request = this.http.request(new Request(new RequestOptions({
			method: RequestMethod.Get,
			url: "/api/v1/time",
			headers: header
		})));
		
		//Parse json response
		return request.map(res => res.json());
	}
}