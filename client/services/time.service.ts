//Modules
import {Injectable} from "angular2/core";
import {Http, Headers, Request, RequestOptions, RequestMethod} from "angular2/http";

@Injectable()
export class TimeService{
	
	constructor(private http: Http){
		this.http = http;
	}
	
	//Gets the current time
	current(){
		
		//Make http get request
		var request = this.http.request(new Request(new RequestOptions({
			method: RequestMethod.Get,
			url: "/api/v1/time"
		})));
		
		//Parse json response
		return request
			.map(res => res.json())
			.map(res => {
				
				//Check response for errors
				if (res.hasOwnProperty('error')){
					throw new Error(res.error);
				}else{
					return res.time;
				}
			});
	}
}