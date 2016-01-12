//Dependancies
import {Component, View} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

//Components
import {FirstComponent} from './first/first.comp';
import {SecondComponent} from './second/second.comp';

//Configuration
@Component({
	template: '<router-outlet></router-outlet>',
	directives: [ROUTER_DIRECTIVES]
})

//Router
@RouteConfig([
	{ path:'/first', name: 'First', component: FirstComponent, useAsDefault: true},
	{ path:'/second', name: 'Second', component: SecondComponent, useAsDefault: false}
])

//Export
export class HomeComponent {}