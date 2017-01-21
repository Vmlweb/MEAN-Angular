//Modules
import * as path from 'path'
import * as async from 'async'
import * as express from 'express'

//Includes
import { log, app, http, https, connections, database } from 'app'

//Frontend
app.use(express.static('./client'))
app.get(/^(?!\/api).*/, (req, res) => {
	res.sendFile(path.resolve('./client/index.html'))
})

log.info('Mounted static frontend')

//Backend
require.ensure([], (require) => {
	app.use('/api', (require('api') as any).router)
})

log.info('Mounted REST API backend')

//Shutdown services
const shutdown = (done?: () => void) => {
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
		if (done){
			done()
		}else{
			process.exit(0)
		}
	})
}

//Intercept kill and end signals
process.once('SIGTERM', shutdown)
process.once('SIGINT', shutdown)

export { shutdown }