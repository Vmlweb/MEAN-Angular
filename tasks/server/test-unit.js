//Modules
const gulp = require('gulp')
const path = require('path')
const decache = require('decache')
const beep = require('beepbeep')
const fs = require('fs')
const jasmine = require('gulp-jasmine')
const sreporter = require('jasmine-spec-reporter')
const reporters = require('jasmine-reporters')
const istanbul = require('gulp-istanbul')
const remap = require('remap-istanbul/lib/gulpRemapIstanbul')
const gutil = require('gulp-util')
const through = require('through2')
const cucumberJunit = require('cucumber-junit')
const childProcess = require('child_process')

//Config
const config = require('../../config.js')
const build = require('./build.js')

/*! Tasks
- server.test.unit
- server.test.unit.execute
- server.test.unit.coverage
*/

//! Server Test
gulp.task('server.test.unit', gulp.series(
	'env.test',
	'env.test.unit',
	'stop',
	'app.clean',
	'build.config',
	'server.build',
	'database.test',
	'server.test.unit.execute',
	'server.test.unit.coverage'
))

//Execute tests and collect coverage
gulp.task('server.test.unit.execute', function(done){

	//Clear node require cache
	decache(path.resolve('builds/server/main.js'))

	//Check whether build is invalid
	if (!build.valid){
		beep(2)
		done()
		return
	}

	//Execute jasmine tests
	let fail = false
	gulp.src('builds/server/main.js')
		.pipe(jasmine({
			errorOnFail: true,
			reporter: [
				new sreporter.SpecReporter(),
				new reporters.JUnitXmlReporter({
					filePrefix: '',
					savePath: 'logs/tests/server/unit',
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
					dir: 'logs/tests/server/unit'
				}
			}
		}))
		.on('end', function(){
			beep(fail ? 2 : 1)
			done()
    })
})

//Remap and log coverage reports
gulp.task('server.test.unit.coverage', function(){
	return gulp.src('logs/tests/server/unit/coverage.json')
		.pipe(remap({
			reports: {
				'text-summary': null,
				json: 'logs/tests/server/unit/coverage.json',
				html: 'logs/tests/server/unit/html',
				clover: 'logs/tests/server/unit/coverage.clover'
			}
		}))
})
