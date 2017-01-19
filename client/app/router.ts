//Modules
import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', loadChildren: './home#HomeModule' },
	{ path: 'work', loadChildren: './work#WorkModule' }
]

export const routing: ModuleWithProviders = RouterModule.forRoot(routes)