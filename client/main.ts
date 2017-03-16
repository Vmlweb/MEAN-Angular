//Libraries
import 'libs'
import 'vendor'

//Modules
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { enableProdMode } from '@angular/core'

//Includes
import { AppModule } from 'app'

//Production
if (process.env.ENV === 'production') {
	enableProdMode()
}

//Bootstrap
platformBrowserDynamic().bootstrapModule(AppModule)