//Modules
const gulp = require('gulp')
const path = require('path')
const beep = require('beepbeep')
const decache = require('decache')
const karma = require('karma').Server
const runner = require('karma').runner
const remap = require('remap-istanbul/lib/gulpRemapIstanbul')

//Config
const config = require('../../config.js')
const build = require('./build.js')

/*! Tasks 
- client.test.unit
- client.test.unit.execute
- client.test.unit.coverage
- client.test.unit.close
*/

//! Client Test
gulp.task('client.test.unit', gulp.series(
	'env.test',
	'env.test.unit',
	'stop',
	'app.clean',
	'build',
	'database.test',
	'mock.start',
	'client.test.unit.execute',
	'client.test.unit.coverage',
	'mock.stop',
	'stop',
	'client.test.unit.close'
))

//Execute tests and collect coverage
gulp.task('client.test.unit.execute', function(done){
	
	//Clear node require cache
	decache(path.resolve('builds/server/main.js'))
	decache(path.resolve('builds/client/main.js'))
	
	//Create list of libraries to includes
	const libs = config.libs.map(function(item){
		return {
			included: path.extname(item) === '.js',
			pattern: path.join('./client/libs/', path.basename(item))
		}
	})
	
	//Setup karma configuration
	new karma({
		basePath: './builds',
		
		//Frameworks and plugins
		frameworks: [ 'jasmine' ],
		plugins: [
			'karma-coverage',
			'karma-jasmine',
			'karma-junit-reporter',
			'karma-phantomjs-launcher',
			'karma-sourcemap-loader',
			'karma-spec-reporter',
			'karma-webpack'
		],
		
		//Settings
		browsers: [ 'PhantomJS2' ],
		colors: true,
		autoWatch: process.env.MODE === 'watch',
		singleRun: process.env.MODE === 'single',
		failOnEmptyTestSuite: false,
		autoWatchBatchDelay: 1000,
		
		//PhantomJS
		customLaunchers: {
			PhantomJS2: {
				base: 'PhantomJS',
				options: {
					settings: {
						webSecurityEnabled: false
					}
				},
				flags: [
					'--web-security=false',
					'--ignore-ssl-errors=true'	
				],
				debug: false
			}
		},
		
		//Files
		preprocessors: { './client/main.js': [ 'webpack', 'sourcemap' ] },
		files: [ './client/main.js' ].concat(libs),
		
		//Webpack
		webpack: build.webpack,
	    webpackMiddleware: { stats: 'errors-only' },
		
		//Reporting
		reporters: [ 'spec', 'junit', 'coverage' ],
		coverageReporter: {
			reporters: [{
				type: 'json',
				dir:'../logs/tests/client/unit',
				file: 'coverage.json',
				subdir: '.'
			}]
		},
		junitReporter: {
			outputDir: '../logs/tests/client/unit'
		}

	}, function(){
		done()
	})
	.on('browser_complete', function(browser){
		beep(browser.lastResult.failed > 0 ? 2 : 1)
	})
	.start()
})

//Remap and log coverage reports 
gulp.task('client.test.unit.coverage', function(){
	return gulp.src('logs/tests/client/unit/coverage.json')
		.pipe(remap({
			reports: {
				'text-summary': null,
				json: 'logs/tests/client/unit/coverage.json',
				html: 'logs/tests/client/unit/html',
				clover: 'logs/tests/client/unit/coverage.clover'
			}
		}))
})

//Finish testing and end process
gulp.task('client.test.unit.close', function(done){
	done()
	setTimeout(process.exit, 100)
})