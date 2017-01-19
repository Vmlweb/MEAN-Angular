//Modules
import * as fs from 'fs'
import * as path from 'path'
import * as moment from 'moment'
import * as winston from 'winston'
import * as rotate from 'winston-daily-rotate-file'

//Create log paths
const errorPath = './logs/errors'
const infoPath = './logs/info'
const accessPath = './logs/access'

//Check if directories exist and create
try { fs.statSync(errorPath) } catch(e) { fs.mkdirSync(errorPath) }
try { fs.statSync(infoPath) } catch(e) { fs.mkdirSync(infoPath) }
try { fs.statSync(accessPath) } catch(e) { fs.mkdirSync(accessPath) }

//Setup logging output formatter
const formatter = (options) => {
	let format = '(' + moment().format('YYYY-MM-DD_HH-mm-ss') + ') '
	format += '[' + (winston.config as any).colorize(options.level,options.level.toUpperCase()) + '] '
    format += options.message
    if (options.meta.length > 0){
        format += JSON.stringify(options.meta)
    }
    return format
}

//Setup log file transports
let transports = [
	new rotate({
	    name: 'error',
	    level: 'error',
	    filename: path.join(errorPath, 'error.json'),
	    datePattern: '.yyyy-MM-dd',
        json: true,
        colorize: false,
    }),
    new rotate({
	    name: 'info',
	    level: 'info',
	    filename: path.join(infoPath, 'info.json'),
	    datePattern: '.yyyy-MM-dd',
        json: true,
        colorize: false,
    }),
    new rotate({
	    name: 'verbose',
	    level: 'verbose',
	    filename: path.join(accessPath, 'access.json'),
	    datePattern: '.yyyy-MM-dd',
        json: true,
        colorize: false,
    }),
    new winston.transports.Console({
	    name: 'console',
		level: 'info',
        json: false,
        colorize: true,
        formatter: formatter
    })
]

//Setup logger with transports
const log = new winston.Logger({
    transports: transports,
    exitOnError: false
})

//TELL THE WORLD IT'S READY!!!!!!!!!!!
log.info('Logger initialized')

export { log }