//Modules
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {enableProdMode} from '@angular/core';

//Includes
import {AppComponent} from './app/app.component';
import {APP_ROUTER_PROVIDERS} from './app/app.routes';

//Production
if (process.env.ENV === 'dist') {
	enableProdMode();
}

//Application
bootstrap(AppComponent, [
	APP_ROUTER_PROVIDERS,
	HTTP_PROVIDERS,
	{ provide: LocationStrategy, useClass: HashLocationStrategy }
]).catch(err => console.error(err));