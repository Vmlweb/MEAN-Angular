//Modules
import * as path from 'path'
import * as mongoose from 'mongoose'
import * as fs from 'fs'

//Includes
const config = require('config')
import { log } from 'server/app'

export class Mongo{

	connection: mongoose.Connection

	constructor(){
		let uri: string
		let host: string

		//Use ES6 for mongoose promise
		(mongoose as any).Promise = Promise

		//Prepare connection string
		const auth = config.database.auth.username + ':' + config.database.auth.password

		//Prepare connection parameters
		const params = ['ssl=' + config.database.ssl.enabled]
		if (config.database.repl.enabled){
			params.push('replicaSet=' + config.database.repl.name)

			//Create reply connection uri
			host = config.database.repl.nodes.map(node => node.hostname + ':' + node.port).join(',')
			uri = 'mongodb://' + auth + '@' + host + '/' + config.database.auth.database + '?' + params.join('&')

		}else{

			//Create standalone connection uri
			host = config.database.standalone.hostname + ':' + config.database.standalone.port
			uri = 'mongodb://' + auth + '@' + host + '/' + config.database.auth.database + '?' + params.join('&')
		}

		//Specify ssl info
		const options = {
			sslValidate: config.database.ssl.validate,
			sslKey: config.database.ssl.validate ? fs.readFileSync(path.join('./certs', config.database.ssl.key)) : undefined,
			sslCert: config.database.ssl.validate ? fs.readFileSync(path.join('./certs', config.database.ssl.cert)) : undefined,
			sslCA: config.database.ssl.validate ? fs.readFileSync(path.join('./certs', config.database.ssl.ca)) : undefined,
			readPreference: config.database.repl.read || 'nearest',
			keepAlive: true
		}

		//Create connection to database
		setTimeout(() => {
			mongoose.connect(uri, options as any)
		}, process.env.NODE_ENV === 'production' ? 3000 : 500)

		//Listen for connection changes
		this.connection = mongoose.connection
		this.connection.on('error', (error) => {
			log.error('Error connecting to database at ' + host, error.message)
		})
		this.connection.once('open', () => {
			log.info('Connected ' + (config.database.ssl.enabled ? 'securely ' : '' ) + 'to database at ' + host)
		})
		this.connection.on('close', () => {
			log.info('Database connection closed')
		})
		this.connection.on('disconnect', () => {
			log.warn('Database disconnected, reconnecting...')
			mongoose.connect(uri, options as any)
		})
	}
}
