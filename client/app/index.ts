//Modules
import { NgModule, ApplicationRef } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HMRModule } from '../hmr'

//Includes
import { ApiModule } from 'client/api'
import { routing } from './router'
import { AppComponent } from './app.component'

@NgModule({
	imports: [
		BrowserModule,
		ApiModule,
		routing
	],
	declarations: [ AppComponent ],
	bootstrap: [ AppComponent ]
})

export class AppModule extends HMRModule {

	constructor(public appRef: ApplicationRef){
		super(appRef)
	}

}
