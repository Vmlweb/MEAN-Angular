//Modules
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'

//Imports
import { UserService } from './user.service'

@NgModule({
	imports: [ CommonModule, HttpClientModule ],
	providers: [ UserService ]
})

export class ApiModule {}

//Exports
export * from './user.model'
export * from './user.service'