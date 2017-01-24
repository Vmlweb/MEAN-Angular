//Modules
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpModule } from '@angular/http'

//Imports
import { UserService } from './user.service'

@NgModule({
	imports: [ CommonModule, HttpModule ],
	providers: [ UserService ]
})

export class ApiModule {}

//Exports
export * from './user.model'
export * from './user.service'