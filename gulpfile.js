//Modules
var gulp = require("gulp");
var reference = require("undertaker-forward-reference");
var dockerode = require("dockerode");
var docker = dockerode();
var config = require("./config.js");
gulp.registry(reference());

//! Tasks
require("./tasks/app.js");
require("./tasks/build.js");
require("./tasks/database.js");
require("./tasks/setup.js");
require("./tasks/dist.js");
require("./tasks/docs.js");
//Client
require("./tasks/client/build.js");
require("./tasks/client/test.js");
require("./tasks/client/watch.js");
//Server
require("./tasks/server/build.js");
require("./tasks/server/test.js");
require("./tasks/server/watch.js");

//! Main Tasks
gulp.task("default", gulp.series("dev"));
 
//! Setup
gulp.task("setup", gulp.series(
	gulp.parallel("stop"),
	gulp.parallel("setup.dependant", "setup.typings", "setup.docker", "setup.certs"),
	gulp.parallel("build.semantic"),
	gulp.parallel("database.reset")
));
 
//! Development
gulp.task("dev", gulp.series(
	gulp.parallel("env.dev"),
	gulp.parallel("stop"),
	gulp.parallel("clean"),
	gulp.parallel("build"),
	gulp.parallel("start"),
	gulp.parallel("server.watch", "client.watch", "app.attach")
));

//! Testing
gulp.task("test", gulp.series(
	gulp.parallel("env.test"),
	gulp.parallel("server.test"),
	gulp.parallel("client.test")
));
 
//! Distribution
gulp.task("dist", gulp.series(
	gulp.parallel("env.dist"),
	gulp.parallel("stop"),
	gulp.parallel("clean"),
	gulp.parallel("semantic"),
	gulp.parallel("build"),
	gulp.parallel("dist.copy"),
	gulp.parallel("dist.minify"),
	gulp.parallel("dist.obfuscate"),
	gulp.parallel("dist.build")
));

//! Documentation
gulp.task("docs", gulp.series(
	gulp.parallel("docs.reset"),
	gulp.parallel("docs.recursive")
));
 
//! Database & App
gulp.task("start", gulp.series("database.start", "app.start"));
gulp.task("stop", gulp.series("app.stop", "database.stop"));
gulp.task("restart", gulp.series("stop", "start"));
gulp.task("reload", gulp.series("app.stop", "app.start"));
gulp.task("reset", gulp.parallel("database.reset"));
 
//! Convenience
gulp.task("clean", gulp.parallel("dist.reset", "build.reset"));
gulp.task("certs", gulp.parallel("setup.certs"));
gulp.task("semantic", gulp.parallel("build.semantic"));
gulp.task("build", gulp.parallel("client.build", "server.build", "build.config"));

//Enviroment variables
gulp.task("env.dev", function(done) { process.env.NODE_ENV = "dev"; done(); });
gulp.task("env.test", function(done) { process.env.NODE_ENV = "test"; done(); });
gulp.task("env.dist", function(done) { process.env.NODE_ENV = "dist"; done(); });

//Stop database and app server on exit 
var exec = require("child_process").exec;
var shutdown = function(){
	var app = docker.getContainer(config.name + "_app");
	var db = docker.getContainer(config.name + "_db");
	app.stop(function(err, data){
		app.remove(function(err, data){
			db.stop(function(err, data){
				db.remove(function(err, data){
					process.exit(0);
				});
			});
		});
	});
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);