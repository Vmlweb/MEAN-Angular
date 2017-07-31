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
- client.test.feature
- client.test.feature.execute
- client.test.feature.coverage
- client.test.feature.close
*/

//! Client Test
gulp.task('client.test.feature', gulp.series(
	'env.test',
	'env.test.feature',
	'stop',
	'app.clean',
	'build',
	'database.test',
	'mock.start',
	'client.test.feature.execute',
	'client.test.feature.coverage',
	'mock.stop',
	'stop',
	'client.test.feature.close'
))

//Execute tests and collect coverage
gulp.task('client.test.feature.execute', function(done){
	
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
	
	global['Cucumber'] = require('cucumber')
	
	//Setup karma configuration
	new karma({
		basePath: './builds',
		
		//Frameworks and plugins
		frameworks: [ 'cucumber-js' ],
		plugins: [
			'karma-coverage',
			'karma-cucumber-js',
			//'karma-junit-reporter',
			'karma-phantomjs-launcher',
			'karma-sourcemap-loader',
			//'karma-spec-reporter',
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
		files: [
			{ pattern: '../client/api/test.feature', included: false },
			{ pattern: '../client/api/insert.feature', included: false },
			'./client/main.js'
		].concat(libs),
		
		//Webpack
		webpack: build.webpack,
	    webpackMiddleware: { stats: 'errors-only' },
		
		bddJSONReporter: {
		  outputFile: 'results.json' // 'results.json' will be filled with all scenarios test results
		},
		
		//Reporting
		reporters: [ 'bdd-json' ],//'spec', 'junit', 'coverage' ],
		coverageReporter: {
			reporters: [{
				type: 'json',
				dir:'../logs/tests/client/feature',
				file: 'coverage.json',
				subdir: '.'
			}]
		},
		junitReporter: {
			outputDir: '../logs/tests/client/feature'
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
gulp.task('client.test.feature.coverage', function(){
	return gulp.src('logs/tests/client/feature/coverage.json')
		.pipe(remap({
			reports: {
				'text-summary': null,
				json: 'logs/tests/client/feature/coverage.json',
				html: 'logs/tests/client/feature/html',
				clover: 'logs/tests/client/feature/coverage.clover'
			}
		}))
})

//Finish testing and end process
gulp.task('client.test.feature.close', function(done){
	done()
	setTimeout(process.exit, 100)
})