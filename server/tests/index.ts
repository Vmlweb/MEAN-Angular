//Modules
import * as async from 'async'
import { Model } from 'mongoose'

//Includes
import { log, database, app } from 'app'
import { User } from 'models'

class Collection{
	
	modified = false
	
	constructor(public name: string, public model: Model<any>, public data: Object[]){
		
		//Subscribe to model change hooks
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
		
		//Drop collection contents
		try{ await database.db.dropCollection(this.name) }catch(err){}
		
		log.info('Populating ' + this.name + ' with test data')
		
		//Populate collection with data
		await this.model.insertMany(this.data)
	}
}

const collections = [
	new Collection('users', User, require('./users.json'))
]

//Create reset hook
const globals = global as any
if (globals.beforeEachHooks && globals.afterEachHooks){
	app.delete('/api/reset', (req, res) => {
		async.eachSeries(globals.beforeEachHooks.concat(globals.afterEachHooks), (item: any, done) => {
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
const modified = (model: Model<any>) => {
	for (const col of collections){
		if (col.model === model){
			col.modified = true
		}
	}
}

//Populate all collections with default data
beforeAll(done => {
	
	//Loop through each collection and reset
	Promise.all(collections.map(col => col.reset()))
		.then(() => {
			done()
		})
		.catch((err) => {
			console.log(err)
			done()
		})
})

//Reset all collections that have been changed with default data
beforeEach(done => {
	
	//Loop through each modified collection and reset
	Promise.all(collections.filter(col => col.modified).map(col => col.reset()))
		.then(() => {
			done()
		})
		.catch((err) => {
			console.log(err)
			done()
		})
})

export { Collection, collections, modified }