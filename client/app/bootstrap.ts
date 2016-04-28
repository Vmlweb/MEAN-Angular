//Modules
import 'rxjs/Rx';
import {AppComponent} from './app.comp';
import {bootstrap} from 'angular2/platform/browser';

//Providers
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

//Hashed URL
import {provide} from 'angular2/core';
import {LocationStrategy, HashLocationStrategy} from 'angular2/platform/common';

//Bootstrap application
bootstrap(AppComponent,[
	ROUTER_PROVIDERS,
	HTTP_PROVIDERS,
	provide(LocationStrategy, {useClass: HashLocationStrategy})
]);