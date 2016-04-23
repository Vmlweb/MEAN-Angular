//Modules
var gulp = require("gulp");
var shell = require("gulp-shell");
var del = require("del");
var fs = require("fs");
var path = require("path");
var config = require("../config.js");
var dockerode = require("dockerode");
var docker = dockerode();

/*! Tasks 
- database.start
- database.test
- database.stop

- database.reset
- database.reset.clean
- database.reset.config
*/

//! Database Server

//Prepare command
var cmd = ["mongod", "--auth", "--keyFile", path.join("/home/certs/", config.database.repl.key), "--replSet", config.database.repl.name];

//Prepare SSL
if (config.database.ssl.enabled){
	cmd.push("--sslMode");
	cmd.push("requireSSL");
	cmd.push("--sslPEMKeyFile");
	cmd.push(path.join("/home/certs/", config.database.ssl.pem));
}

//Start database server
gulp.task("database.start", (done) => {
	
	//Prepare container
	docker.createContainer({
		Hostname: config.database.repl.nodes[0].hostname,
		Image: "mongo",
		Cmd: cmd,
		name: config.name + "_db",
		Volumes: {
			"/home/certs": {}
		}
	}, (err, container) => {
		if (err){ throw err; }
		
		//Start container
		container.start({
			Binds: [
				path.join(process.cwd(), "data") + ":/data/db",
				path.join(process.cwd(), "certs") + ":/home/certs"
			],
			PortBindings: {
				["27017/tcp"]: [{ HostPort: config.database.repl.nodes[0].port.toString()}]
			}
		}, (err, data) => {
			if (err){ throw err; }
			setTimeout(done, 1500);
		});
	});
});

//Start testing database server (flushes data when finished)
gulp.task("database.test", (done) => {
	
	//Prepare container
	docker.createContainer({
		Hostname: config.database.repl.nodes[0].hostname,
		Image: "mongo",
		Cmd: cmd,
		name: config.name + "_db",
		Volumes: {
			"/home/certs": {}
		}
	}, (err, container) => {
		if (err){ throw err; }
		
		//Start container
		container.start({
			Binds: [
				path.join(process.cwd(), "certs") + ":/home/certs"
			],
			PortBindings: {
				["27017/tcp"]: [{ HostPort: config.database.repl.nodes[0].port.toString()}]
			}
		}, (err, data) => {
			if (err){ throw err; }
			setTimeout(done, 1500);
		});
	});
});

//Stop database server
gulp.task("database.stop", (done) => {
	var container = docker.getContainer(config.name + "_db");
	container.remove((err, data) => {
		container.stop((err, data) => {
			container.remove((err, data) => {
				setTimeout(done, 1000);
			});
		});
	});
});

//! Reset Data
gulp.task("database.reset", gulp.series(
	gulp.parallel("database.stop", "build.config.mongodb"),
	gulp.series("database.reset.clean", "database.start", "database.reset.config", "database.stop")
));

//Remove all database files
gulp.task("database.reset.clean", (done) => {
	return del([
		"data/**/*"
	]);
});

//Reconfigure database with mongodb.js
gulp.task("database.reset.config", (done) => {
	var container = docker.getContainer(config.name + "_db");
	
	//Prepare command
	var cmd = ["mongo"];
	
	//Prepare SSL
	if (config.database.ssl.enabled){
		cmd.push("--ssl");
		cmd.push("--sslAllowInvalidCertificates");
	}
	
	//Prepare command
	container.exec({
		Cmd: cmd,
		AttachStdin: true,
		AttachStdout: true,
		Tty: false
	}, (err, exec) => {
		if (err){ throw err; }
		
		//Execute command
		exec.start({
			hijack: true,
			stdin: true,
			stdout: true
		}, (err, stream) => {
			if (err){ throw err; }
						
			//Stream output to console
	        container.modem.demuxStream(stream, process.stdout, process.stderr);
		
			//Stream file into container mongo cli
			fs.createReadStream("builds/mongodb.js", "binary").pipe(stream).on("end", () => {
				setTimeout(done, 500);
			});
		});
	});
});