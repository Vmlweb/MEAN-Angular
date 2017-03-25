//Modules
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

//Includes
import { ApiModule } from '../api'
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

export class AppModule {}