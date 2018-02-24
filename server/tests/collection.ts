//Modules
import { Model } from 'mongoose'

//Includes
import { log, database } from 'server/app'

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
