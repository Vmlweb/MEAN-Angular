module.exports = {

	//! Process
	name: 'MEAN Stack',
	config: '/opt/mean/config.js',

	//! Docker
	docker: {
		socketPath: process.platform === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock'
	},

	//! HTTP
	http: {
		hostname: '::',
		url: '127.0.0.1',
		port: {
			internal: 58011,
			external: 58012,
			dev: 58013
		}
	},

	//! HTTPS
	https: {
		hostname: '::',
		url: '127.0.0.1',
		port: {
			internal: 58021,
			external: 58022,
			dev: 58023
		},
		ssl: {
			key: 'https.key',
			cert: 'https.cert'
		}
	},

	//! Database
	database: {
		path: '/opt/mean/data',
		auth: {
			username: 'mean',
			password: 'm3an',
			database: 'mean'
		},
		ssl: {
			enabled: true,
			key: 'mongo.key',
			cert: 'mongo.cert',
			pem: 'mongo.pem',
			ca: '',
			validate: false
		},
		standalone: {
			hostname: '172.17.0.1',
			port: 58031
		},
		repl: {
			enabled: false,
			name: 'rs0',
			read: 'nearest',
			key: 'repl.key',
			nodes: []
		}
	},

	//! Logs
	logs: {
		path: '/opt/mean/logs',
		format: ':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] :referrer :user-agent'
	},

	//! Certs
	certs: {
		path: '/opt/mean/certs'
	},

	//! Client Libraries
	libs: [],

	//! Typescript Types
	types: {
		server: [ 'async', 'body-parser', 'compression', 'express', 'helmet', 'moment', 'mongoose', 'morgan', 'winston' ],
		client: [ 'jquery' ]
	},

	//! Test Plans
	tests: {
		server: {
			v1: [ 'api/v1/**/*' ],
			users: [ 'api/v1/users/**/*' ]
		},
		client: {
			client: [ '**/*' ]
		}
	}
}
