//Modules
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const winston = require('winston');
const winstonRotate = require('winston-daily-rotate-file');

//Create log paths
let errorPath = path.join(__logs, 'errors');
let infoPath = path.join(__logs, 'info');
let accessPath = path.join(__logs, 'access');

//Check if directories exist and create
try { fs.statSync(errorPath); } catch(e) { fs.mkdirSync(errorPath); }
try { fs.statSync(infoPath); } catch(e) { fs.mkdirSync(infoPath); }
try { fs.statSync(accessPath); } catch(e) { fs.mkdirSync(accessPath); }

//Logging output formatter
let formatter = function(options){
	let format = '(' + moment().format('YYYY-MM-DD_HH-mm-ss') + ') ';
    format += '[' + winston.config.colorize(options.level,options.level.toUpperCase()) + '] ';
    format += options.message;
    if (options.meta.length > 0){
        format += JSON.stringify(options.meta);
    }
    return format;
};

//Setup log file transports
let transports = [
	new winstonRotate({
	    name: 'error',
	    level: 'error',
	    filename: path.join(errorPath, 'error.json'),
	    datePattern: '.yyyy-MM-dd',
        json: true,
        colorize: false,
    }),
    new winstonRotate({
	    name: 'info',
	    level: 'info',
	    filename: path.join(infoPath, 'info.json'),
	    datePattern: '.yyyy-MM-dd',
        json: true,
        colorize: false,
    }),
    new winstonRotate({
	    name: 'verbose',
	    level: 'verbose',
	    filename: path.join(accessPath, 'access.json'),
	    datePattern: '.yyyy-MM-dd',
        json: true,
        colorize: false,
    }),
];

//Setup log console transports
if (process.env.NODE_ENV != 'silent'){
	transports.push(
		new winston.transports.Console({
		    name: 'console',
            level: 'info',
            json: false,
            colorize: true,
            formatter: formatter
        }));
    transports.push(
        new winston.transports.Console({
		    name: 'consoleError',
            level: 'error',
            json: true,
            colorize: true,
            formatter: formatter
        }));
}

//Setup winston logger and stream transports
let logger = new winston.Logger({
    transports: transports,
    exitOnError: false
});

//Globalize new logger
log = {};
log.stream = {
	write: function(message, encoding){
        logger.verbose(message.replace(/^\s+|\s+$/g, ''));
    }
};
log.error = logger.error;
log.warn = logger.warn;
log.info = logger.info;
log.verbose = logger.verbose;
log.debug = logger.debug;
log.silly = logger.silly;

//Tell the world it's so!
log.info('Logger initialized');

module.exports = logger;