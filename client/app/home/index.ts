//Modules
import { NgModule } from '@angular/core'
import { BrowserModule }  from '@angular/platform-browser'
import { RouterModule, Routes } from '@angular/router'

//Includes
import { routing } from './router';
import { HomeComponent } from './home.component'

@NgModule({
	imports: [ routing ],
	declarations: [ HomeComponent ]
})

export class HomeModule {}