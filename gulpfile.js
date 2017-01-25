//Modules
const gulp = require('gulp')
const reference = require('undertaker-forward-reference')
const rl = require("readline")

//Includes
const config = require('./config.js')
const docker = require('dockerode')(config.docker)
gulp.registry(reference())

//! Tasks
require('./tasks/app.js')
require('./tasks/build.js')
require('./tasks/database.js')
require('./tasks/setup.js')
require('./tasks/dist.js')
require('./tasks/test.js')

//Server
require('./tasks/server/build.js')
require('./tasks/server/lint.js')
require('./tasks/server/test.js')
require('./tasks/server/watch.js')

//! Main Task
gulp.task('default', gulp.series('dev'))
 
//! Setup
gulp.task('setup', gulp.series(
	'stop',
	'clean',
	'install',
	'certs',
	'reset'
))

//! Database
gulp.task('reset', gulp.series(
	'stop',
	'build.clean',
	'build.config.mongodb',
	'database.clean',
	'database.start',
	'database.setup',
	'database.stop'
))

//! Development
gulp.task('dev', gulp.series(
	'env.watch',
	'env.dev',
	'stop',
	'build.clean',
	'build',
	'lint',
	'start',
	'server.watch',
	'server.watch.build'
))

//! Server
gulp.task('server', gulp.series(
	'env.watch',
	'env.test',
	'stop',
	'app.clean',
	'build.clean',
	'build.config',
	'server.build',
	'database.test',
	'server.test.execute',
	'server.lint',
	'server.watch',
	'server.watch.test'
))

//! Testing
gulp.task('test', gulp.series(
	'env.test',
	'stop',
	'app.clean',
	'build.clean',
	'build',
	'database.test',
	'server.test.execute',
	'server.test.coverage'
))

//! Mocking
gulp.task('mock', gulp.series(
	'env.test',
	'stop',
	'build.clean',
	'build.config',
	'server.build',
	'database.test',
	'mock.start'
))
 
//! Distribution
gulp.task('dist', gulp.series(
	'env.dist',
	'stop',
	'build.clean',
	'build',
	'dist.clean',
	'dist.copy',
	'dist.build'
))

//! Process Convenience
gulp.task('start', gulp.series('database.start', 'app.start'))
gulp.task('stop', gulp.series('app.stop', 'database.stop'))
gulp.task('wait', function(done){ setTimeout(done, 1000) })

//! Setup Convenience
gulp.task('clean', gulp.parallel('build.clean', 'app.clean', 'database.clean', 'dist.clean'))
gulp.task('docker', gulp.parallel('install.nodejs', 'install.mongodb'))

//! Build Convenience
gulp.task('build', gulp.parallel('build.config', 'server.build'))
gulp.task('lint', gulp.series('server.lint'))

//! Enviroment Variables
process.env.MODE = 'single'
gulp.task('env.watch', function(done) { process.env.MODE = 'watch'; done() })
gulp.task('env.dev', function(done) { process.env.NODE_ENV = 'development'; done() })
gulp.task('env.test', function(done) { process.env.NODE_ENV = 'testing'; done() })
gulp.task('env.dist', function(done) { process.env.NODE_ENV = 'production'; done() })

//! Server Test Plans
for (const i in config.tests.server){
	if (config.tests.server.hasOwnProperty(i)){
		(function(i) {
			gulp.task('server.' + i + '.test', gulp.series(function(done){
				process.env.TEST = i
				done()
			}, 'server.test'))
			gulp.task('server.' + i, gulp.series(function(done){
				process.env.TEST = i
				done()
			}, 'server'))
		})(i)
	}
}

//Stop database and app containers on exit
const shutdown = function(){
	const app = docker.getContainer(config.name + '_app')
	const db = docker.getContainer(config.name + '_db')
	app.stop({ t: 10 }, function(err, data){
		db.stop({ t: 10 }, function(err, data){
			process.exit()
		})
	})
}

//Handle windows watch shutdown
if (process.platform === 'win32'){
	rl.createInterface({ input: process.stdin, output: process.stdout }).on('SIGINT', function() { shutdown() })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)