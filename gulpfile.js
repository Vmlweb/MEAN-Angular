//Modules
const gulp = require('gulp')
const reference = require('undertaker-forward-reference')
const docker = require('dockerode')()

//Includes
const config = require('./config.js')
gulp.registry(reference())

//! Tasks
require('./tasks/app.js')
require('./tasks/build.js')
require('./tasks/database.js')
require('./tasks/setup.js')
require('./tasks/dist.js')
require('./tasks/docs.js')
require('./tasks/test.js')

//Client
require('./tasks/client/build.js')
require('./tasks/client/lint.js')
require('./tasks/client/test.js')
require('./tasks/client/watch.js')

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
	'setup.install',
	'setup.certs',
	'build.semantic',
	'reset'
))
 
//! Development
gulp.task('dev', gulp.series(
	'env.dev',
	'stop',
	'clean',
	'build',
	'start',
	'app.attach',
	'watch'
))

//! Database
gulp.task('reset', gulp.series(
	'database.stop',
	'database.clean',
	'build.config.mongodb',
	'database.start',
	'database.setup',
	'database.stop'
))

//! Testing
gulp.task('test', gulp.series(
	'server.test',
	'client.test',
	'test.merge'
))

//! Mocking
gulp.task('mock', gulp.series(
	'env.test',
	'stop',
	'clean',
	'build.config',
	'server.build',
	'database.test',
	'database.setup',
	'app.start',
	'app.attach',
	'server.watch'
))
 
//! Distribution
gulp.task('dist', gulp.series(
	'env.dist',
	'stop',
	'clean',
	'semantic',
	'build',
	'dist.copy',
	'dist.build'
))

//! Database & App
gulp.task('start', gulp.series('database.start', 'app.start'))
gulp.task('stop', gulp.series('app.stop', 'database.stop'))

//! Setup Convenience
gulp.task('clean', gulp.parallel('setup.clean', 'build.clean', 'dist.clean'))
gulp.task('docker', gulp.parallel('setup.install.nodejs', 'setup.install.mongodb'))
gulp.task('certs', gulp.parallel('setup.certs'))

//! Build Convenience
gulp.task('semantic', gulp.parallel('build.semantic'))
gulp.task('lint', gulp.parallel('client.lint', 'server.lint'))
gulp.task('build', gulp.parallel('build.config', 'client.build', 'server.build'))
gulp.task('watch', gulp.parallel('client.watch', 'server.watch'))
gulp.task('docs', gulp.parallel('api.docs'))

//! Enviroment Variables
gulp.task('env.dev', function(done) { process.env.NODE_ENV = 'development'; done() })
gulp.task('env.test', function(done) { process.env.NODE_ENV = 'testing'; done() })
gulp.task('env.dist', function(done) { process.env.NODE_ENV = 'production'; done() })

//! Test Plans
for (let i in config.tests){
	(function(i) {
		gulp.task(i + '.test', gulp.series(function(done){
			process.env.TEST = i
			done()
		}, 'server.test'))
	})(i)
}

//Stop database and app containers on exit
let shutdown = function(){
	let app = docker.getContainer(config.name + '_app')
	let db = docker.getContainer(config.name + '_db')
	app.stop({ t: 5 }, function(err, data){
		app.remove({ force: true }, function(err, data){
			db.stop({ t: 5 }, function(err, data){
				db.remove({ force: true }, function(err, data){
					if (!global.hasOwnProperty('app')){
						process.exit()
					}
				})
			})
		})
	})
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)