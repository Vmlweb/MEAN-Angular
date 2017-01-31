//Modules
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

//Includes
import { routing } from './router'
import { HomeComponent } from './home.component'

@NgModule({
	imports: [ CommonModule, FormsModule, routing ],
	declarations: [ HomeComponent ]
})

export class HomeModule {}