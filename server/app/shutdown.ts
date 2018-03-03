//Modules
import * as async from 'async'

//Includes
import { log, app, http, https, connections, database } from 'server/app'

//Shutdown
export const shutdown = (done?: () => void) => {
	log.info('Graceful shutdown...')

	//Destroy client connection sockets
	Object.keys(connections).forEach((key) => {
		connections[key].destroy()
	})

	//Close web and database connections
	async.each([ http, https, database ], (server, callback) => {
		server.close(() => {
			callback()
		})
	}, () => {

		//Remove kill and end listeners
		process.removeListener('SIGTERM', shutdown)
		process.removeListener('SIGINT', shutdown)

		//Execute callback or close process
		if (done instanceof Function){
			done()
		}else{
			process.exit(0)
		}
	})
}
