//Dependancies
import {Component, View, OnInit} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";

//Includes
import {Time} from "../../services/time.service";

//Configuration
@Component({
	templateUrl: "home/second/second.html",
	directives: [ROUTER_DIRECTIVES],
	providers: [Time]
})

//Export
export class SecondComponent {
	
	//Properties
	timeOut: string;
	timeIn: Time;
	
	//Constructor
	constructor(time: Time){
		this.timeOut = "Loading...";
		this.timeIn = time;
	}

	//On Loaded
	ngOnInit(){
		setInterval(() => {
			
			//Subscribe to time observer
			this.timeIn.currentTime().subscribe(
				data => {
					
					//Check for response error
					if (data.hasOwnProperty("error")){
						this.timeOut = data.error;
					}				
					
					this.timeOut = data.time;
				},
				err => {
					this.timeOut = err;
				}
			);
			
		}, 200);
	}
}