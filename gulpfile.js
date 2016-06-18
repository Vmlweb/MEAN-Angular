//Modules
var gulp = require('gulp');
var reference = require('undertaker-forward-reference');
var docker = require('dockerode')();

//Config
var config = require('./config.js');
gulp.registry(reference());

//! Tasks
require('./tasks/app.js');
require('./tasks/build.js');
require('./tasks/database.js');
require('./tasks/setup.js');
require('./tasks/dist.js');
require('./tasks/docs.js');
//Client
require('./tasks/client/build.js');
require('./tasks/client/lint.js');
require('./tasks/client/test.js');
//Server
require('./tasks/server/build.js');
require('./tasks/server/lint.js');
require('./tasks/server/test.js');
require('./tasks/server/watch.js');

//! Main Tasks
gulp.task('default', gulp.series('dev'));
 
//! Setup
gulp.task('setup', gulp.series(
	'stop',
	gulp.parallel('setup.dependant', 'setup.typings', 'setup.docker', 'setup.certs'),
	'build.semantic',
	'database.reset'
));
 
//! Development
gulp.task('dev', gulp.series(
	'env.dev',
	'stop',
	'clean',
	'build',
	'start',
	gulp.parallel('server.watch', 'app.attach')
));

//! Testing
gulp.task('test', gulp.series(
	'env.test',
	'server.test',
	'client.test'
));

//! Mocking
gulp.task('mock', gulp.series(
	'env.test',
	'stop',
	'clean',
	gulp.parallel('server.build', 'build.config'),
	'database.test',
	'database.reset.config',
	'database.mock',
	'server.watch'
));
 
//! Distribution
gulp.task('dist', gulp.series(
	'env.dist',
	'stop',
	'clean',
	'semantic',
	'build',
	'dist.copy',
	'dist.build'
));

//! Database & App
gulp.task('start', gulp.series('database.start', 'app.start'));
gulp.task('stop', gulp.series('app.stop', 'database.stop'));
gulp.task('restart', gulp.series('stop', 'start'));
gulp.task('reload', gulp.series('app.stop', 'app.start'));
gulp.task('reset', gulp.series('database.reset'));
 
//! Setup Convenience
gulp.task('clean', gulp.parallel('build.reset', 'dist.reset'));
gulp.task('certs', gulp.parallel('setup.certs'));
gulp.task('docker', gulp.parallel('setup.docker'));

//! Build Convenience
gulp.task('semantic', gulp.parallel('build.semantic'));
gulp.task('docs', gulp.parallel('api.docs'));
gulp.task('lint', gulp.parallel('client.lint', 'server.lint'));
gulp.task('build', gulp.parallel('client.build', 'server.build', 'build.config'));

//Enviroment Variables
gulp.task('env.dev', function(done) { process.env.NODE_ENV = 'dev'; done(); });
gulp.task('env.test', function(done) { process.env.NODE_ENV = 'test'; done(); });
gulp.task('env.dist', function(done) { process.env.NODE_ENV = 'dist'; done(); });

//! Test Plans
for (var i in config.tests){
	(function(i) {
		gulp.task(i + '.test', gulp.series(function (done){
			process.env.test = i;
			done();
		}, 'server.test'));
	})(i);
}

//Stop database and app containers on exit
var shutdown = function(){
	var app = docker.getContainer(config.name + '_app');
	var db = docker.getContainer(config.name + '_db');
	app.stop({ t: 5 }, function(err, data){
		app.remove({ force: true }, function(err, data){
			db.stop({ t: 5 }, function(err, data){
				db.remove({ force: true }, function(err, data){
					if (!global.hasOwnProperty('app')){
						process.exit();
					}
				});
			});
		});
	});
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);