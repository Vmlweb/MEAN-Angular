//Modules
const gulp = require('gulp')
const path = require('path')
const beep = require('beepbeep')
const karma = require('karma').Server
const remap = require('remap-istanbul/lib/gulpRemapIstanbul')

//Config
const config = require('../../config.js')
const build = require('./build.js')

/*! Tasks 
- client.test

- client.test.execute
- client.test.coverage
*/

//! Client Test
gulp.task('client.test', gulp.series(
	'env.test',
	'stop',
	'clean',
	'build',
	'database.test',
	'database.setup',
	'client.test.execute',
	'client.test.coverage'
))

//Execute tests and collect coverage
gulp.task('client.test.execute', function(done){
	
	//Compile library includes
	let libs = []
	for (let item in config.libs){
		libs.push({
			included: path.extname(config.libs[item]) === '.js',
			pattern: path.join('./builds/client/libs/', path.basename(config.libs[item]))
		})
	}
	
	//Setup karma configuration
	let server = new karma({
		basePath: '',
		
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
		autoWatch: false,
		singleRun: true,
		
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
		preprocessors: {
			'./builds/client/main.js': [ 'webpack', 'sourcemap' ]
		},
		files: [
			'./builds/client/main.js'
		].concat(libs),
		
		//Webpack
		webpack: build.webpack,
	    webpackMiddleware: { stats: 'errors-only' },
		
		//Reporting
		reporters: [ 'spec', 'junit', 'coverage' ],
		coverageReporter: {
			reporters: [{
				type: 'json',
				dir:'logs/client',
				file: 'coverage.json',
				subdir: '.'
			}]
		},
		junitReporter: {
			outputDir: 'logs/tests/client'
		}
		
	}, function(failed){
		
		//Beep to alert user
	    if (failed){
			beep(2)
		}else{
			beep()
		}
	    
	    done()
	}).start()
})

//Remap and log coverage reports 
gulp.task('client.test.coverage', function(){
	return gulp.src('logs/client/coverage.json')
		.pipe(remap({
			reports: {
				'text-summary': null,
				json: 'logs/client/coverage.json',
				html: 'logs/client/html',
				clover: 'logs/client/coverage.clover'
			}
		}))
})