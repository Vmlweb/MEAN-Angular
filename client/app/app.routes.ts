//Modules
import {provideRouter, RouterConfig} from '@angular/router';

//Routes
import {FirstComponent} from './routes/first/first.component';
import {SecondComponent} from './routes/second/second.component';

export const routes: RouterConfig = [
	{ path: '', component: FirstComponent },
	{ path: 'second', component: SecondComponent },
];

export const APP_ROUTER_PROVIDERS = [
	provideRouter(routes)
];