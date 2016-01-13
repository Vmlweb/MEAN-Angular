//Dependancies
import {Component, View, OnInit} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";

//Includes
import {TimeService} from "../../services/time.service";

//Configuration
@Component({
	templateUrl: "home/second/second.html",
	directives: [ROUTER_DIRECTIVES],
	providers: [TimeService]
})

//Export
export class SecondComponent {
	
	//Properties
	time: string;
	timeService: TimeService;
	
	//Constructor
	constructor(timeService: TimeService){
		this.time = "Loading...";
		this.timeService = timeService;
	}

	//On Loaded
	ngOnInit(){
		setInterval(() => {
			
			//Subscribe to time observer
			this.timeService.current().subscribe(
				data => {
					
					//Check for response error
					if (data.hasOwnProperty("error")){
						this.time = data.error;
					}				
					
					this.time = data.time;
				},
				err => {
					this.time = err;
				}
			);
			
		}, 200);
	}
}