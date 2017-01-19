//Modules
import { NgModule } from '@angular/core'
import { BrowserModule }  from '@angular/platform-browser'
import { RouterModule, Routes } from '@angular/router'

//Includes
import { routing } from './router';
import { WorkComponent } from './work.component'

@NgModule({
	imports: [ routing ],
	declarations: [ WorkComponent ]
})

export class WorkModule {}