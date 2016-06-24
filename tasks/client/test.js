//Modules
var gulp = require('gulp');
var beep = require('beepbeep');
var Karma = require('karma').Server;
var remap = require('remap-istanbul');

//Config
var config = require('../../config.js');

/*! Tasks 
- client.test

- client.test.karma
*/

//! Test
gulp.task('client.test', gulp.series(
	'env.test',
	'stop',
	'clean',
	'build',
	'database.test',
	'database.reset.config',
	'database.mock',
	'client.test.karma'
));

//Test client with karma
gulp.task('client.test.karma', function(done){
	var server = new Karma({
		basePath: '',
		
		//Frameworks and plugins
		frameworks: ['jasmine'],
		plugins: [
			'karma-coverage',
			'karma-phantomjs-launcher',
			'karma-jasmine',
			'karma-mocha-reporter',
			'karma-junit-reporter',
			'karma-webpack',
			'karma-sourcemap-loader',
			'karma-remap-istanbul'
		],
		
		//Settings
		browsers: ['PhantomJS'],
		colors: true,
		autoWatch: false,
		singleRun: true,
		
		//Files
		files: [ { pattern: './karma.shim.js' } ],
		preprocessors: { './karma.shim.js': ['webpack', 'sourcemap'] },
		
		//Webpack
		webpack: global.webpack,
	    webpackMiddleware: { stats: 'errors-only' },
		
		//Reporting
		reporters: ['mocha', 'junit', 'coverage', 'karma-remap-istanbul'],
		coverageReporter: {
			reporters: [
				{type: 'json', dir:'logs/coverage/client', file: 'coverage-final.json', subdir: '.'},
				{type: 'text-summary'}
			]
		},
		junitReporter: {
			outputDir: 'logs/tests/client'
		}
		
	}, function(failed){
		
		//Lookup typescript generated code from source map
		remap('logs/coverage/client/coverage-final.json', {
			json: 'logs/coverage/client/coverage-final.json',
			html: 'logs/coverage/client',
			clover: 'logs/coverage/client/clover.xml'
		}).then(function(){
			
			//Reports written
			if (failed){
				beep(2);
			}else{
				beep();
			}
			global.shutdown(done);
		});
		
	}).start();
});