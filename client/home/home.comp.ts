//Modules
import {Component, View} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

//Includes
import {FirstComponent} from './first/first.comp';
import {SecondComponent} from './second/second.comp';

@Component({
	template: '<router-outlet></router-outlet>',
	directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
	{ path:'/first', name: 'First', component: FirstComponent, useAsDefault: true},
	{ path:'/second', name: 'Second', component: SecondComponent, useAsDefault: false}
])

export class HomeComponent {}