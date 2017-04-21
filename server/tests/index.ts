//Modules
import * as async from 'async'
import { Model } from 'mongoose'

//Includes
import { log, app } from 'app'

//Load list of collections to process
import { collections } from './collection-list'

//Create http reset test data endpoint, check whether running in mock mode
const globals = global as any
if (globals.beforeEachHooks && globals.afterEachHooks){
	
	//Add delete endpoint to express app
	app.delete('/api', (req, res) => {
		
		//Execute jasmine after and before hooks
		async.eachSeries(globals.afterEachHooks.concat(globals.beforeEachHooks), (item: any, done) => {
			item(() => {
				done()
			})
		}, (err) => {
			if (err){
				log.error('Error executing test data reset endpoint', err)
			}
			res.json({})
		})
	})
	
	log.info('Created reset test data endpoint')
}

//Mark specific collection as modified
export const modified = (model: Model<any>) => {
	for (const col of collections){
		if (col.model === model){
			col.modified = true
		}
	}
}

//Populate all collections with default test data
beforeAll(done => {
		
	//Loop through each collection and reset
	Promise.all(collections.map(col => col.reset()))
		.then(() => { done() })
		.catch((err) => {
			log.error('Error resetting test data for all collections before tests', err)
			done()
		})
		
})

//Reset all collections that have been changed with default data
beforeEach(done => {
	
	//Loop through each modified collection and reset
	Promise.all(collections.filter(col => col.modified).map(col => col.reset()))
		.then(() => { done() })
		.catch((err) => {
			log.error('Error resetting test data for modified collections before test', err)
			done()
		})
})