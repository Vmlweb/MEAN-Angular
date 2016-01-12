//Dependancies
import {Component, View} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";

//Configuration
@Component({
	templateUrl: "home/second/second.html",
	directives: [ROUTER_DIRECTIVES]
})

//Export
export class SecondComponent {
	
	//Properties
	time: string;
	
	//Constructor
	constructor(){
		this.time = "Loading...";
	}
	
}