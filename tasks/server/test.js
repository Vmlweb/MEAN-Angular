//Modules
const gulp = require('gulp')
const path = require('path')
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
	'server.build',
	'build.config',
	'database.test',
	'database.setup',
	'server.test.execute',
	'server.test.report'
))

//Execute server tests with reports
gulp.task('server.test.execute', function(done){
	gulp.src('builds/server/main.js')
		.pipe(jasmine({
			errorOnFail: false,
			reporter: [
				new sreporter.SpecReporter(),
				new reporters.JUnitXmlReporter({
					filePrefix: '',
					savePath: 'logs/server',
					consolidateAll: false
				})
			]
		}))
		.on('error', (err) => {
			beep(2)
			setTimeout(() => {
				done(err)
			}, 500)
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
		.on('end', () => {
			beep()
			done()
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