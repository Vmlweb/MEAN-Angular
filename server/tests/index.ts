//Modules
import * as async from 'async'
import { Model } from 'mongoose'

//Includes
import { log, database, app } from 'app'

export class Collection{
	
	modified = false
	
	constructor(public name: string, public model: Model<any>, public data: Object[]){
		
		//Subscribe to mongoose model change hooks and mark collection as modified
		model.schema.pre('save', (next) => {
			this.modified = true
			next()
		})
		model.schema.pre('remove', (next) => {
			this.modified = true
			next()
		})
		model.schema.pre('update', (next) => {
			this.modified = true
			next()
		})
		
		//Overide global mongoose model change hooks and mark collection as modified 
		for (const hook of [ 'findByIdAndUpdate', 'findByIdAndRemove', 'findOneAndUpdate', 'findOneAndRemove', 'update', 'remove', 'create' ]){
			(model as any)['___' + hook] = model[hook]
			model[hook] = (...args) => {
				this.modified = true
				return (model as any)['___' + hook](...args)
			}
		}
	}
	
	async reset(){
		
		//Drop collection contents silently
		try{ 
			await database.db.dropCollection(this.name)
		}catch(err){}
		
		log.info('Clearing and populating ' + this.name + ' with test data')
		
		//Populate collection with test data and without validation
		await this.model.insertMany(this.data)
		
		//Reset modified flag
		this.modified = false
	}
}

//Load list of collections to process
import { collections } from './collections'

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