//Modules
import { ApplicationRef } from '@angular/core'
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr'

export class HMRModule {

	constructor(public appRef: ApplicationRef){}

	hmrOnInit(store) {
		if (store && store.state){

			//Restore state
			//AppStore = store.state

			if ('restoreInputValues' in store) {
				store.restoreInputValues()
			}
			this.appRef.tick()
			delete store.state
			delete store.restoreInputValues
		}
	}

	hmrOnDestroy(store) {
		const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement)
		store.disposeOldHosts = createNewHosts(cmpLocation)

		//Save state
		//store.state = AppStore

		store.restoreInputValues  = createInputTransfer()
		removeNgStyles()
	}

	hmrAfterDestroy(store) {
		store.disposeOldHosts()
		delete store.disposeOldHosts
	}
}
