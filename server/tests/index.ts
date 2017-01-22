//Modules
import * as async from 'async'
import { Model } from 'mongoose'

//Includes
import { log, database, app } from 'app'

//Models
import { User } from 'models'

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
	}
	
	async reset(){
		
		//Drop collection contents silently
		try{ await database.db.dropCollection(this.name) }catch(err){}
		
		log.info('Populating ' + this.name + ' with test data')
		
		//Populate collection with test data and without validation
		await this.model.insertMany(this.data)
	}
}

export const collections = [
	new Collection('users', User, require('./users.json'))
]

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
		.catch((err) => { done() })
})

//Reset all collections that have been changed with default data
beforeEach(done => {
	
	//Loop through each modified collection and reset
	Promise.all(collections.filter(col => col.modified).map(col => col.reset()))
		.then(() => { done() })
		.catch((err) => { done() })
})