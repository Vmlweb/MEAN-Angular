//Modules
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpModule } from '@angular/http'

//Includes
import { UserService } from './user.service'

@NgModule({
	imports: [
		CommonModule,
		HttpModule
	],
	providers: [ UserService ]
})

export class ApiModule {}