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
const glob = require('glob')

//Config
const config = require('../../config.js')
const build = require('./build.js')

/*! Tasks 
- server.test.feature
- server.test.feature.execute
- server.test.feature.coverage
*/

//! Server Test
gulp.task('server.test.feature', gulp.series(
	'env.test',
	'env.test.feature',
	'stop',
	'app.clean',
	'build.config',
	'server.build',
	'database.test',
	'server.test.feature.execute',
	'server.test.feature.coverage'
))

//Execute tests and collect coverage
gulp.task('server.test.feature.execute', function(done){
	
	//Check whether build is invalid
	if (!build.valid){
		beep(2)
		done()
		return
	}
	
	//Create directory for output
	try{ fs.mkdirSync('./logs/tests') }catch(err){}
	try{ fs.mkdirSync('./logs/tests/server') }catch(err){}
	try{ fs.mkdirSync('./logs/tests/server/feature') }catch(err){}
	
	//Check whether test plan is in used
	let features
	if (process.env.hasOwnProperty('TEST_PLAN')){
		
		//Loop through each matcher and load features
		features = []
		for (const matcher of config.tests.server[process.env.TEST_PLAN]){
			features = features.concat(glob.sync('./server/' + matcher + '.feature'))
		}
		
	}else{
		
		//Load all features
		features = glob.sync('./server/**/*.feature')
	}
	
    //Construct process parameters
	const parameters = [
		'-r', './builds/server/main.js',
		'-f', 'json:./logs/tests/server/feature/cucumber.json', 
		'-f', 'pretty'
	].concat(features)
	
	//Spawn cucumber process
	const cucumber = childProcess.fork('./node_modules/.bin/cucumber.js', parameters)
	cucumber.on('exit', code => {
		
		//Load coverage data from file
		const coverage = fs.readFileSync('./logs/tests/server/feature/coverage.json')
		global['__coverage__'] = JSON.parse(coverage)
		
		//Convert 
		gulp.src('./logs/tests/server/feature/cucumber.json')
	        .pipe(cucumberXML({
		        strict: true
		    }))
		    .pipe(gulp.dest('./logs/tests/server/feature'))
	        .pipe(istanbul.writeReports({
				coverageVariable: '__coverage__',
				reporters: [ 'json' ],
				reportOpts: {
					json: {
						file: 'coverage.json',
						dir: 'logs/tests/server/feature'
					}
				}
			}))
			.on('end', function(){
				beep(code === 1 ? 2 : 1)
				done()
		    })
	})
})

//Remap and log coverage reports 
gulp.task('server.test.feature.coverage', function(){
	return gulp.src('logs/tests/server/feature/coverage.json')
		.pipe(remap({
			reports: {
				'text-summary': null,
				json: 'logs/tests/server/feature/coverage.json',
				html: 'logs/tests/server/feature/html',
				clover: 'logs/tests/server/feature/coverage.clover'
			}
		}))
})

//JUnit Cucumber Conversion
const cucumberXML = (opts) => {	  
    return through.obj((file, enc, cb) => {
        var suffix = file.path.match(/\/cucumber-?(.*)\.json/)
        if (suffix) {
            opts.prefix = suffix[1] + ';'
        }
        var xml = cucumberJunit(file.contents, opts)
        file.contents = new Buffer(xml)
        file.path = gutil.replaceExtension(file.path, '.xml')
        cb(null, file)
    })
}