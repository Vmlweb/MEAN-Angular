//Modules
const path = require("path");
const fs = require("fs-extra");
const morgan = require("morgan");
const moment = require("moment");
const winston = require("winston");
const winstonRotate = require("winston-daily-rotate-file");
const app = require("express")();

//Check and create log directories
const errorPath = path.join(__logs, "errors");
if (!fs.ensureDirSync(errorPath)){
	fs.mkdirsSync(errorPath);
}
const infoPath = path.join(__logs, "info");
if (!fs.ensureDirSync(infoPath)){
	fs.mkdirsSync(infoPath);
}
const accessPath = path.join(__logs, "access");
if (!fs.ensureDirSync(accessPath)){
	fs.mkdirsSync(accessPath);
}

//Logging output formatter
const formatter = (options) => {
	var format = "(" + moment().format("YYYY-MM-DD_HH-mm-ss") + ") ";
    format += "[" + winston.config.colorize(options.level,options.level.toUpperCase()) + "] ";
    format += options.message;
    if (options.meta.length > 0){
        format += JSON.stringify(options.meta);
    }
    return format;
};

//Setup log file transports
const transports = [
	new winstonRotate({
	    name: "error",
	    level: "error",
	    filename: path.join(errorPath, "error.json"),
	    datePattern: ".yyyy-MM-dd",
        json: true,
        colorize: false,
    }),
    new winstonRotate({
	    name: "info",
	    level: "info",
	    filename: path.join(infoPath, "info.json"),
	    datePattern: ".yyyy-MM-dd",
        json: true,
        colorize: false,
    }),
    new winstonRotate({
	    name: "verbose",
	    level: "verbose",
	    filename: path.join(accessPath, "access.json"),
	    datePattern: ".yyyy-MM-dd",
        json: true,
        colorize: false,
    }),
];

//Setup log console transports
if (process.env.NODE_ENV != "silent"){
	transports.push(
		new winston.transports.Console({
		    name: "console",
            level: "info",
            json: false,
            colorize: true,
            formatter: formatter
        }));
    transports.push(
        new winston.transports.Console({
		    name: "consoleError",
            level: "error",
            json: true,
            colorize: true,
            formatter: formatter
        }));
}

//Setup winston logger and stream transports
const logger = new winston.Logger({
    transports: transports,
    exitOnError: false
});

//Globalize new logger
log = {};
log.stream = {
	write: (message, encoding) => {
        logger.verbose(message.replace(/^\s+|\s+$/g, ""));
    }
};
log.error = logger.error;
log.warn = logger.warn;
log.info = logger.info;
log.verbose = logger.verbose;
log.debug = logger.debug;
log.silly = logger.silly;

//Tell the world it"s so!
log.info("Logger initialized");

module.exports = logger;