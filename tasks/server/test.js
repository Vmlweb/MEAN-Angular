//Modules
const gulp = require('gulp')
const path = require('path')
const decache = require('decache')
const beep = require('beepbeep')
const jasmine = require('gulp-jasmine')
const sreporter = require('jasmine-spec-reporter')
const reporters = require('jasmine-reporters')
const istanbul = require('gulp-istanbul')
const remap = require('remap-istanbul/lib/gulpRemapIstanbul')

//Config
const config = require('../../config.js')

/*! Tasks 
- server.test

- server.test.execute
- server.test.report
*/

//! Test
gulp.task('server.test', gulp.series(
	'env.test',
	'stop',
	'clean',
	'build.config',
	'server.build',
	'database.test',
	'database.setup',
	'server.test.execute',
	'server.test.report'
))

//Execute server tests with reports
gulp.task('server.test.execute', function(){
	decache(path.resolve('builds/server/main.js'))
	decache('jasmine')
	let fail = false
	return gulp.src('builds/server/main.js')
		.pipe(jasmine({
			errorOnFail: true,
			reporter: [
				new sreporter.SpecReporter(),
				new reporters.JUnitXmlReporter({
					filePrefix: '',
					savePath: 'logs/server',
					consolidateAll: false
				})
			]
		}))
		.on('error', function(err){
			fail = true
			this.emit('end')
	    })
		.pipe(istanbul.writeReports({
			coverageVariable: '__coverage__',
			reporters: [ 'json' ],
			reportOpts: {
				json: {
					file: 'coverage.json',
					dir: 'logs/server'
				}
			}
		}))
		.on('end', function(){
			beep(fail ? 2 : 1)
	    })
})

//Create server tests coverage reports
gulp.task('server.test.report', function(){
	return gulp.src('logs/server/coverage.json')
		.pipe(remap({
			reports: {
				'text-summary': null,
				json: 'logs/server/coverage.json',
				html: 'logs/server/html',
				clover: 'logs/server/coverage.clover'
			}
		}))
})