//Modules
import * as async from 'async'

//Includes
import { log } from 'server/app'
import { Winston } from './winston'
import { Mongo } from './mongo'
import { Express } from './express'

export class App{

	winston: Winston
	mongo: Mongo
	express: Express

	destroyTrigger: NodeJS.SignalsListener

	constructor(){

		//Create destroy functino at correct scope
		const self = this
		this.destroyTrigger = () => { self.destroy() }

		//Add end process listeners
		process.on('SIGTERM', this.destroyTrigger)
		process.on('SIGINT', this.destroyTrigger)
		process.on('SIGUSR2', this.destroyTrigger)

		//Start app
		this.winston = new Winston()
		this.mongo = new Mongo()
		this.express = new Express()
	}

	destroy(done?: () => void){
		log.info('Graceful shutdown...')

		//Destroy client connection sockets
		Object.keys(this.express.connections).forEach((key) => {
			this.express.connections[key].destroy()
		})

		//Close web and database connections
		const servers = [ this.express.http, this.express.https, this.mongo.connection ]
		async.each(servers, (server: any, callback: any) => {
			server.close(() => {
				callback()
			})
		}, () => {

			//Remove end process listeners
			process.removeListener('SIGTERM', this.destroyTrigger)
			process.removeListener('SIGINT', this.destroyTrigger)
			process.removeListener('SIGUSR2', this.destroyTrigger)

			//Execute callback or close process
			if (done instanceof Function){
				done()
			}else if (process.env.NODE_ENV === 'development'){
				process.kill(process.pid, 'SIGUSR2')
			}else{
				process.exit()
			}
		})
	}

}
