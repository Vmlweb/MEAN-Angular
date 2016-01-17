module.exports = {
	
	//! Process
	name: "mean",
	config: "/opt/mean/config.js",
	
	//! HTTP
	http: {
		hostname: "0.0.0.0",
		url: "test.vmlweb.co.uk",
		port: {
			internal: "8080",
			external: "80"
		}
	},
	
	//! HTTPS
	https: {
		hostname: "0.0.0.0",
		url: "test.vmlweb.co.uk",
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
				hostname: "test.vmlweb.co.uk",
				port: 27017 
			}]
		}
	},
	
	//! Certificates
	certs: {
		path: "/opt/mean/certs",
		details: {
			hostname: "test.vmlweb.co.uk",
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