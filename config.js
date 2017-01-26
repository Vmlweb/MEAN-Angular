module.exports = {
	
	//! Process
	name: 'mean',
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
			internal: '8080',
			external: '80'
		}
	},
	
	//! HTTPS
	https: {
		hostname: '::',
		url: '127.0.0.1',
		port: {
			internal: '4434',
			external: '443'
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
			key: 'mongodb.key',
			cert: 'mongodb.cert',
			pem: 'mongodb.pem',
			ca: '',
			validate: false
		},
		repl: {
			enabled: false,
			name: 'rs0',
			read: 'nearest',
			key: 'repl.key',
			nodes: [{
				hostname: '192.168.0.9',
				port: 27017 
			}]
		}
	},
	
	//! Client Libraries
	libs: [
		
		//Semantic UI
		'semantic/dist/semantic.min.css',
		'semantic/dist/*/**/*',
		'!semantic/dist/components/**/*'
	],
	
	//! Typescript Types
	types: {
		server: [ 'async', 'body-parser', 'compression', 'express', 'helmet', 'moment', 'mongoose', 'morgan', 'winston' ],
		client: [ 'jquery', 'jasmine' ]
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
	},
	
	//! Certificates
	certs: {
		path: '/opt/mean/certs',
		details: {
			hostname: '127.0.0.1',
			organisation: 'Vmlweb Ltd',
			country: 'GB',
			state: 'Kent',
			city: 'London'
		}
	},
	
	//! Logs
	logs: {
		path: '/opt/mean/logs',
		format: ':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] :referrer :user-agent'
	}
	
}