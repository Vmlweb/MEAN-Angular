//Modules
import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

//Includes
import { WorkComponent } from './work.component'

export const routes: Routes = [
	{ path: '', component: WorkComponent }
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)