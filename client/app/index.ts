//Modules
import { NgModule } from '@angular/core'
import { BrowserModule }  from '@angular/platform-browser'
import { RouterModule, Routes } from '@angular/router'

//Includes
import { routing } from './router';
import { AppComponent } from './app.component'

@NgModule({
	imports: [
		BrowserModule,
		routing
	],
	declarations: [ AppComponent ],
	bootstrap: [ AppComponent ]
})

export class AppModule {}