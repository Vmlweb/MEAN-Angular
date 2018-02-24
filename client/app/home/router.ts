//Modules
import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

//Includes
import { HomeComponent } from './home.component'

export const routes: Routes = [
	{ path: '', component: HomeComponent }
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
