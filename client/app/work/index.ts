//Modules
import { NgModule } from '@angular/core'

//Includes
import { routing } from './router'
import { WorkComponent } from './work.component'

@NgModule({
	imports: [ routing ],
	declarations: [ WorkComponent ]
})

export class WorkModule {}