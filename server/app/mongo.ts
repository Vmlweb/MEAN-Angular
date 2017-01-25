//Modules
import * as path from 'path'
import * as mongoose from 'mongoose'
import * as fs from 'fs'

//Includes
import { config } from 'shared'
import { log } from 'app'

//Prepare connection string
const auth = config.database.auth.username + ':' + config.database.auth.password
const nodes = config.database.repl.nodes.map(node => node.hostname + ':' + node.port)

//Prepare connection parameters
const params = ['ssl=' + config.database.ssl.enabled]
if (config.database.repl.enabled){
	params.push('replicaSet=' + config.database.repl.name)
}

//Create connection to database
setTimeout(() => {
	mongoose.connect('mongodb://' + auth + '@' + nodes.join(',') + '/' + config.database.auth.database + '?' + params.join('&'), { 
		replset: {
			sslValidate: config.database.ssl.validate,
			sslKey: config.database.ssl.validate ? fs.readFileSync(path.join('./certs', config.database.ssl.key)) : undefined,
			sslCert: config.database.ssl.validate ? fs.readFileSync(path.join('./certs', config.database.ssl.cert)) : undefined,
			sslCA: config.database.ssl.validate ? fs.readFileSync(path.join('./certs', config.database.ssl.ca)) : undefined,
			readPreference: config.database.repl.read || 'nearest'
		}
	})
}, process.env.NODE_ENV === 'production' ? 3000 : 100)

//Listen for connection changes
const connection = mongoose.connection
connection.on('error', (error) => {
	log.error('Error connecting to database at ' + nodes.join(','), error.message)
})
connection.once('open', () => {
	log.info('Connected ' + (config.database.ssl.enabled ? 'securely ' : '' ) + 'to database at ' + nodes.join(','))
})
connection.on('close', () => {
	log.info('Database connection closed')
})

export { connection as database }