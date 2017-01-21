//Modules
import { NgModule } from '@angular/core'

//Includes
import { routing } from './router'
import { HomeComponent } from './home.component'

@NgModule({
	imports: [ routing ],
	declarations: [ HomeComponent ]
})

export class HomeModule {}