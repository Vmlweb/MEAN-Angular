//Modules
import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

//Includes
import {HomeComponent} from '../home/home.comp';

@Component({
	selector: 'my-app',
	template: '<router-outlet></router-outlet>',
	directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
	{ path:'/home/...', name: 'Home', component: HomeComponent, useAsDefault: true }
])

export class AppComponent {}