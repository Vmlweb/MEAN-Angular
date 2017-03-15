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
import { log } from 'app'

//Attach request logger
const app = express()
app.enable('trust proxy')
app.use(morgan(config.logs.format, { stream: {
	write: (message) => { log.verbose(message.replace(/^\s+|\s+$/g, '')) }
}}))

log.info('Express initialized')

//Attach express middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(sanitize({ replaceWith: '_' }))
app.use(helmet())
app.use(compression())

log.info('Express middleware attached')

//Prepare server variables
let httpServer
let httpsServer
const connections: { [key: string]: net.Socket } = {}

//Check whether http hotname was given
if (config.http.hostname.length > 0){
	
	//Create server and listen
	httpServer = http.createServer(app).listen(config.http.port.internal, config.http.hostname, () => {
		log.info('HTTP listening at ' + config.http.hostname + ':' + config.http.port.internal)
		
		//Keep connections list up to date
		httpServer.on('connection', (con) => {
			const key = crypto.randomBytes(32).toString('hex')
			connections[key] = con
			con.on('close', () => {
				delete connections[key]
			})
		})
		
		//Log connection closed
		httpServer.on('close', () => {
			log.info('HTTP server closed')
		})
	})
}

//Check whether https hotname was given
if (config.https.hostname.length > 0 && config.https.ssl.key.length > 0 && config.https.ssl.cert.length > 0){
	
	//Create server and listen
	httpsServer = https.createServer({
		key: fs.readFileSync(path.join('./certs', config.https.ssl.key)) || '',
		cert: fs.readFileSync(path.join('./certs', config.https.ssl.cert)) || ''
	}, app).listen(config.https.port.internal, config.https.hostname, () => {
		log.info('HTTPS listening at ' + config.https.hostname + ':' + config.https.port.internal)
		
		//Keep connections list up to date
		httpsServer.on('connection', (con) => {
			const key = crypto.randomBytes(32).toString('hex')
			connections[key] = con
			con.on('close', () => {
				delete connections[key]
			})
		})
		
		//Log connection closed
		httpsServer.on('close', () => {
			log.info('HTTPS server closed')
		})
	})
}

export { app, httpServer as http, httpsServer as https, connections }