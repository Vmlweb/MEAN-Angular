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
- client.test

- client.test.execute
- client.test.coverage
- client.test.close
*/

//! Client Test
gulp.task('client.test', gulp.series(
	'env.test',
	'stop',
	'clean',
	'build',
	'database.test',
	'database.setup',
	'mock.start',
	'client.test.execute',
	'client.test.coverage',
	'mock.stop',
	'client.test.close'
))

//Execute tests and collect coverage
gulp.task('client.test.execute', function(done){
	
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
				dir:'logs/tests/client',
				file: 'coverage.json',
				subdir: '.'
			}]
		},
		junitReporter: {
			outputDir: 'logs/tests/client'
		}

	}, done)
	.on('browser_complete', function(browser){
		beep(browser.lastResult.failed > 0 ? 2 : 1)
	})
	.start()
})

//Remap and log coverage reports 
gulp.task('client.test.coverage', function(){
	return gulp.src('logs/tests/client/coverage.json')
		.pipe(remap({
			reports: {
				'text-summary': null,
				json: 'logs/tests/client/coverage.json',
				html: 'logs/tests/client/html',
				clover: 'logs/tests/client/coverage.clover'
			}
		}))
})

//Finish testing and end process
gulp.task('client.test.close', function(done){
	done()
	setTimeout(process.exit, 100)
})