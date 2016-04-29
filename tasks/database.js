//Modules
var gulp = require("gulp");
var del = require("del");
var fs = require("fs");
var path = require("path");
var docker = require("dockerode")()

//Config
var config = require("../config.js");

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
gulp.task("database.start", function(done){
	
	//Prepare container
	docker.createContainer({
		Hostname: config.database.repl.nodes[0].hostname,
		Image: "mongo",
		Cmd: cmd,
		name: config.name + "_db",
		Volumes: {
			"/home/certs": {}
		}
	}, function(err, container) {
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
		}, function(err, data){
			if (err){ throw err; }
			setTimeout(done, 500);
		});
	});
});

//Start testing database server (flushes data when finished)
gulp.task("database.test", function(done){
	
	//Prepare container
	docker.createContainer({
		Hostname: config.database.repl.nodes[0].hostname,
		Image: "mongo",
		Cmd: cmd,
		name: config.name + "_db",
		Volumes: {
			"/home/certs": {}
		}
	}, function(err, container) {
		if (err){ throw err; }
		
		//Start container
		container.start({
			Binds: [
				path.join(process.cwd(), "certs") + ":/home/certs"
			],
			PortBindings: {
				["27017/tcp"]: [{ HostPort: config.database.repl.nodes[0].port.toString()}]
			}
		}, function(err, data){
			if (err){ throw err; }
			setTimeout(done, 500);
		});
	});
});

//Stop database server
gulp.task("database.stop", function(done){
	//Stop and remove container
	var container = docker.getContainer(config.name + "_db");
	container.remove(function(err, data){
		
		//Check if container still exists
		container.inspect(function (err, data) {
			if (!data){
				done();
			}else{
			
				//Stop and remove again if still existing
				container.stop(function(err, data){
					container.remove(function(err, data){
						done();
					});
				});
			}
		});
	});
});

//! Reset Data
gulp.task("database.reset", gulp.series(
	gulp.parallel("database.stop", "build.config.mongodb"),
	gulp.series("database.reset.clean", "database.start", "database.reset.config", "database.stop")
));

//Remove all database files
gulp.task("database.reset.clean", function(done){
	return del([
		"data/**/*"
	]);
});

//Reconfigure database with mongodb.js
gulp.task("database.reset.config", function(done){
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
	}, function(err, exec) {
		if (err){ throw err; }
		
		//Execute command
		exec.start({
			hijack: true,
			stdin: true,
			stdout: true
		}, function(err, stream) {
			if (err){ throw err; }
						
			//Stream output to console
	        container.modem.demuxStream(stream, process.stdout, process.stderr);
		
			//Stream file into container mongo cli
			fs.createReadStream("builds/mongodb.js", "binary").pipe(stream).on("end", function(){
				done();
			});
		});
	});
});