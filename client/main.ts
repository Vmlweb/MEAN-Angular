//Libraries
import 'client/libs'
import 'client/vendor'

//Modules
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { enableProdMode } from '@angular/core'

//Includes
import { AppModule } from 'client/app'

//Production
if (process.env.ENV === 'production') {
	enableProdMode()
}

//Bootstrap
platformBrowserDynamic().bootstrapModule(AppModule)
