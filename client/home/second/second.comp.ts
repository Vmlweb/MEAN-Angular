//Modules
import {Component, OnInit} from "angular2/core";
import {ROUTER_DIRECTIVES} from "angular2/router";

//Includes
import {TimeService} from "../../services/time.service";

@Component({
	templateUrl: "home/second/second.html",
	directives: [ROUTER_DIRECTIVES],
	providers: [TimeService]
})

export class SecondComponent {
	
	time: string;
	timeService: TimeService;
	
	constructor(timeService: TimeService){
		this.time = "Loading...";
		this.timeService = timeService;
	}

	ngOnInit(){
		
		//Check for new time ever 0.2 seconds
		setInterval(() => {
			
			//Get current time from service
			this.timeService.current().subscribe(
				time => {
					this.time = time;
				},
				error => {
					this.time = error;
				}
			);
			
		}, 200);
	}
}