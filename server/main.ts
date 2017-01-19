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
require.ensure([], function(require){
	app.use('/api', (require('api') as any).router)
})

log.info('Mounted REST API backend')

//Shutdown services
const shutdown = (code) => {
	log.info('Graceful shutdown...')
	
	//Destroy client connection sockets
	for (let i in connections){
		connections[i].destroy()
	}
	
	//Close web and database connections
	async.each([ http, https, database ], (server, done) => {
		server.close(done)
	}, () => {
		process.exit(code)
	})
}

//Intercept kill and end signals
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

export { shutdown }