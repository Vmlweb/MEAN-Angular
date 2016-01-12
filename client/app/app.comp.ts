//Dependancies
import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Http, Headers, RequestMethod} from 'angular2/http';

//Components
import {HomeComponent} from '../home/home.comp';

//Configuration
@Component({
	selector: 'my-app',
	template: '<router-outlet></router-outlet>',
	directives: [ROUTER_DIRECTIVES]
})

//Routing
@RouteConfig([
	{ path:'/home/...', name: 'Home', component: HomeComponent, useAsDefault: true }
])

//Export
export class AppComponent {}