//Modules
import * as async from 'async'
import { Model } from 'mongoose'

//Includes
import { app } from 'server/main'
import { log } from 'server/app'

//Load list of collections to process
import { collections } from './collection-list'

//Add delete endpoint to express app
if (global['afterEachHooks'] && global['beforeEachHooks']){
	app.express.app.delete('/api', (req, res) => {

		//Execute jasmine after and before hooks
		async.eachSeries(global['afterEachHooks'].concat(global['beforeEachHooks']), (item: any, done) => {
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
