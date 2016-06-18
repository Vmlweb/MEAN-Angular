module.exports = {
	
	//! Process
	name: "mean",
	config: "/opt/mean/config.js",
	
	//! HTTP
	http: {
		hostname: "0.0.0.0",
		url: "192.168.21.143",
		port: {
			internal: "8080",
			external: "80"
		}
	},
	
	//! HTTPS
	https: {
		hostname: "0.0.0.0",
		url: "192.168.21.143",
		port: {
			internal: "4434",
			external: "443"
		},
		ssl: {
			key: "https.key",
			cert: "https.cert"
		}
	},
	
	//! Database
	database: {
		path: "/opt/mean/data",
		auth: {
			username: "mean",
			password: "m3an",
			database: "mean"
		},
		ssl: {
			enabled: true,
			key: "mongodb.key",
			cert: "mongodb.cert",
			pem: "mongodb.pem",
			ca: "",
			validate: false
		},
		repl: {
			name: "rs0",
			read: "nearest",
			key: "repl.key",
			nodes: [{
				hostname: "192.168.21.143",
				port: 27017 
			}]
		}
	},
	
	//! Client Libraries
	libraries: [
		//Dependancies
		"bower_components/jquery/dist/jquery.min.js",
		"bower_components/jquery/dist/jquery.min.map",
		//Interface
		"semantic/dist/semantic.min.js",
		"semantic/dist/semantic.min.css",
		"semantic/dist/*/**/*"
	],
	
	//! Server Test Plans
	tests: {
		v1: [
			"/tests/",
			"/api/v1/**/"
		],
		users: [
			"/tests/",
			"/api/v1/users/**/"
		]
	},
	
	//! API Documentation
	docs: {
		v1: [ "/api/v1/**/*.md" ],
		users: [ "/api/v1/users/**/*.md" ]
	},
	
	//! Certificates
	certs: {
		path: "/opt/mean/certs",
		details: {
			hostname: "192.168.21.143",
			organisation: "Vmlweb Ltd",
			country: "GB",
			state: "Kent",
			city: "London"
		}
	},
	
	//! Logs
	logs: {
		path: "/opt/mean/logs",
		format: ":remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] :referrer :user-agent"
	}
	
}