//Modules
import * as net from 'net'
import * as https from 'https'
import * as http from 'http'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import * as morgan from 'morgan'
import * as bodyParser from 'body-parser'
import * as helmet from 'helmet'
import * as compression from 'compression'
import * as sanitize from 'express-mongo-sanitize'
import * as express from 'express'

//Includes
const config = require('config')
import { log } from 'server/app'

export class Express{

	app: express.Application
	http: http.Server
	https: https.Server
	connections: { [key: string]: net.Socket } = {}

	constructor(){

		//Attach request logger
		this.app = express()
		this.app.enable('trust proxy')
		this.app.use(morgan(config.logs.format, { stream: {
			write: (message) => { log.verbose(message.replace(/^\s+|\s+$/g, '')) }
		}}))

		log.info('Express initialized')

		//Attach express middleware
		this.app.use(bodyParser.json())
		this.app.use(bodyParser.urlencoded({ extended: true }))
		this.app.use(sanitize({ replaceWith: '_' }))
		this.app.use(helmet())
		this.app.use(compression())

		log.info('Express middleware attached')

		//Frontend
		this.app.use(express.static('./client'))
		this.app.get(/^(?!\/api).*/, (req, res) => {
			res.sendFile(path.resolve('./client/index.html'))
		})

		log.info('Mounted static frontend')

		//Backend
		import('server/api').then(api => {
			this.app.use('/api', api.router)
			log.info('Mounted REST API backend')
		})

		//Check whether http hotname was given
		if (config.http.hostname.length > 0){

			//Create server and listen
			this.http = http.createServer(this.app).listen(config.http.port.internal, config.http.hostname, () => {
				log.info('HTTP listening at ' + config.http.hostname + ':' + config.http.port.internal)

				//Keep connections list up to date
				this.http.on('connection', (con) => {
					const key = crypto.randomBytes(32).toString('hex')
					this.connections[key] = con
					con.on('close', () => {
						delete this.connections[key]
					})
				})

				//Log connection closed
				this.http.on('close', () => {
					log.info('HTTP server closed')
				})
			})
		}

		//Check whether https hotname was given
		if (config.https.hostname.length > 0 && config.https.ssl.key.length > 0 && config.https.ssl.cert.length > 0){

			//Create server and listen
			this.https = https.createServer({
				key: fs.readFileSync(path.join('./certs', config.https.ssl.key)) || '',
				cert: fs.readFileSync(path.join('./certs', config.https.ssl.cert)) || ''
			}, this.app).listen(config.https.port.internal, config.https.hostname, () => {
				log.info('HTTPS listening at ' + config.https.hostname + ':' + config.https.port.internal)

				//Keep connections list up to date
				this.https.on('connection', (con) => {
					const key = crypto.randomBytes(32).toString('hex')
					this.connections[key] = con
					con.on('close', () => {
						delete this.connections[key]
					})
				})

				//Log connection closed
				this.https.on('close', () => {
					log.info('HTTPS server closed')
				})
			})
		}
	}
}
