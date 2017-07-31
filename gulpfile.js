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

//Client
require('./tasks/client/build.js')
require('./tasks/client/lint.js')
require('./tasks/client/test-unit.js')
require('./tasks/client/test-feature.js')
require('./tasks/client/watch.js')

//Server
require('./tasks/server/build.js')
require('./tasks/server/lint.js')
require('./tasks/server/test-unit.js')
require('./tasks/server/test-feature.js')
require('./tasks/server/watch.js')

//! Main Task
gulp.task('default', gulp.series('dev'))

//! Setup
gulp.task('setup', gulp.series(
	'stop',
	'clean',
	'install',
	'certs',
	'reset',
	'build'
))

//! Database
gulp.task('reset', gulp.series(
	'stop',
	'clean',
	'build.config.mongodb',
	'database.clean',
	'database.start',
	'database.setup',
	'database.stop'
))

//! Theme
gulp.task('theme', gulp.series(
	'env.theme',
	'dev'
))

//! Development
gulp.task('dev', gulp.series(
	'env.watch',
	'env.dev',
	'stop',
	'build',
	'lint',
	'start',
	'server.watch',
	'server.watch.build',
	'client.watch'
))

//! Client
gulp.task('client.unit', gulp.series(
	'env.watch',
	'env.test',
	'env.test.unit',
	'stop',
	'build',
	'database.test',
	'mock.start',
	'client.test.unit.execute',
	'client.lint',
	'client.watch'
))

//! Server Unit
gulp.task('server.unit', gulp.series(
	'env.watch',
	'env.test',
	'env.test.unit',
	'stop',
	'build.config',
	'server.build',
	'database.test',
	'server.test.unit.execute',
	'server.lint',
	'server.watch',
	'server.watch.test.unit'
))

//! Server Feature
gulp.task('server.feature', gulp.series(
	'env.watch',
	'env.test',
	'env.test.feature',
	'stop',
	'build.config',
	'server.build',
	'database.test',
	'server.test.feature.execute',
	'server.lint',
	'server.watch',
	'server.watch.test.feature'
))

//! Testing
gulp.task('test', gulp.series(
	'env.test',
	'env.test.unit',
	'stop',
	'app.clean',
	'build.clean',
	'build',
	'database.test',
	
	'server.test.unit.execute',
	'server.test.unit.coverage',
	
	'env.test.feature',
	'build',
	'server.test.feature.execute',
	'server.test.feature.coverage',
	
	'mock.start',	
	'env.test.unit',
	'build',
	'client.test.unit.execute',
	'client.test.unit.coverage',
	'mock.stop',
	
	'stop',
	'merge',
	'build.clean',
	'client.test.unit.close'
))

//! Server Testing
gulp.task('server.test', gulp.series(
	'env.test',
	'env.test.unit',
	'stop',
	'app.clean',
	'build.clean',
	'build',
	'database.test',
	'server.test.unit.execute',
	'server.test.unit.coverage',
	'env.test.feature',
	'build',
	'server.test.feature.execute',
	'server.test.feature.coverage',
	'stop',
	'merge'
))

//! Client Testing
gulp.task('client.test', gulp.series(
	'env.test',
	'env.test.unit',
	'stop',
	'app.clean',
	'build.clean',
	'build',
	'database.test',
	'mock.start',	
	'env.test.unit',
	'build',
	'client.test.unit.execute',
	'client.test.unit.coverage',
	'mock.stop',
	'stop',
	'merge',
	'build.clean',
	'client.test.unit.close'
))


//! Mocking
gulp.task('mock', gulp.series(
	'env.test',
	'stop',
	'build.config',
	'server.build',
	'database.test',
	'mock.start'
))
 
//! Distribution
gulp.task('dist', gulp.series(
	'env.dist',
	'stop',
	'dist.clean',
	'build.clean',
	'build',
	'dist.copy',
	'dist.build',
	'build.clean'
))

//! Process Convenience
gulp.task('start', gulp.series('database.start', 'app.start'))
gulp.task('stop', gulp.series('app.stop', 'database.stop'))
gulp.task('wait', function(done){ setTimeout(done, 1000) })

//! Setup Convenience
gulp.task('clean', gulp.parallel('build.clean', 'app.clean', 'dist.clean'))
gulp.task('docker', gulp.parallel('install.nodejs', 'install.mongodb'))

//! Build Convenience
gulp.task('build', gulp.parallel('build.config', 'server.build', 'client.build'))
gulp.task('lint', gulp.series('client.lint', 'server.lint'))

//! Enviroment Variables
process.env.MODE = 'single'
gulp.task('env.watch', function(done) { process.env.MODE = 'watch'; done() })
gulp.task('env.theme', function(done) { process.env.THEME = true; done() })
gulp.task('env.dev', function(done) { process.env.NODE_ENV = 'development'; done() })
gulp.task('env.test', function(done) { process.env.NODE_ENV = 'testing'; done() })
gulp.task('env.dist', function(done) { process.env.NODE_ENV = 'production'; done() })
gulp.task('env.test.unit', function(done) { process.env.TEST = 'unit'; done() })
gulp.task('env.test.feature', function(done) { process.env.TEST = 'feature'; done() })

//! Server Test Unit Plans
for (const i in config.tests.server){
	if (config.tests.server.hasOwnProperty(i)){
		(function(i) {
			gulp.task('server.' + i + '.test.unit', gulp.series(function(done){
				process.env.TEST_PLAN = i
				done()
			}, 'server.test.unit'))
			gulp.task('server.' + i + '.unit', gulp.series(function(done){
				process.env.TEST_PLAN = i
				done()
			}, 'server.unit'))
		})(i)
	}
}

//! Server Test Feature Plans
for (const i in config.tests.server){
	if (config.tests.server.hasOwnProperty(i)){
		(function(i) {
			gulp.task('server.' + i + '.test.feature', gulp.series(function(done){
				process.env.TEST_PLAN = i
				done()
			}, 'server.test.feature'))
			gulp.task('server.' + i + '.feature', gulp.series(function(done){
				process.env.TEST_PLAN = i
				done()
			}, 'server.feature'))
		})(i)
	}
}

//! Client Test Unit Plans
for (const i in config.tests.client){
	if (config.tests.client.hasOwnProperty(i)){
		(function(i) {
			gulp.task('client.' + i + '.test.unit', gulp.series(function(done){
				process.env.TEST_PLAN = i
				done()
			}, 'client.test.unit'))
			gulp.task('client.' + i + '.unit', gulp.series(function(done){
				process.env.TEST_PLAN = i
				done()
			}, 'client.unit'))
		})(i)
	}
}

//Stop database and app containers on exit
const shutdown = function(){
	const app = docker.getContainer(config.name + '_app')
	const db = docker.getContainer(config.name + '_db')
	const test = docker.getContainer(config.name + '_db_test')
	app.stop({ t: 10 }, function(err, data){
		db.stop({ t: 10 }, function(err, data){
			test.stop({ t: 10 }, function(err, data){
				process.exit()
			})
		})
	})
}

//Handle windows watch shutdown
if (process.platform === 'win32'){
	rl.createInterface({ input: process.stdin, output: process.stdout }).on('SIGINT', function() { shutdown() })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)