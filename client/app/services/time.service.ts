//Modules
import {Injectable} from "@angular/core";
import {Http, Headers, Request, RequestOptions, RequestMethod} from "@angular/http";

@Injectable()
export class TimeService{
	
	constructor(private http: Http){
		this.http = http;
	}
	
	//Gets the current time
	current(){
		
		//Make request for json response
		return this.http.get("/api/v1/time")
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