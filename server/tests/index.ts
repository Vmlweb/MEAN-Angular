//Modules
import { Model } from 'mongoose'

//Includes
import { log, database } from 'app'
import { User } from 'models'

class Collection{
	
	modified = false
	
	constructor(public name: string, public model: Model<any>, public data: Object[]){
		
		//Subscribe to model change hooks
		model.schema.pre('save', (next) => { this.modified = true next() })
		model.schema.pre('remove', (next) => { this.modified = true next() })
		model.schema.pre('update', (next) => { this.modified = true next() })
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

//Mark specific collection as modified
const modified = (model: Model<any>) => {
	for (const col of collections){
		if (col.model === model){
			col.modified = true
		}
	}
}

//Populate all collections with default data
beforeAll(async callback => {
	
	//Loop through each collection and reset
	try{
		await Promise.all(collections.map(col => col.reset()))
	}catch(err){
		log.info(err)
	}
	
	callback()
})

//Reset all collections that have been changed with default data
beforeEach(async callback => {
	
	//Loop through each modified collection and reset
	try{
		await Promise.all(collections.filter(col => col.modified).map(col => col.reset()))
	}catch(err){
		log.info(err)
	}
	
	callback()
})

export { Collection, collections, modified }