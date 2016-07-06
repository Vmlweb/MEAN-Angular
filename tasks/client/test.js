//Modules
const gulp = require('gulp');
const path = require('path');
const beep = require('beepbeep');
const Karma = require('karma').Server;
const remap = require('remap-istanbul/lib/gulpRemapIstanbul');

//Config
const config = require('../../config.js');

/*! Tasks 
- client.test

- client.test.karma
- client.test.remap
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
	'client.test.karma',
	'client.test.remap'
));

//Test client with karma
gulp.task('client.test.karma', function(done){
	
	//Compile library includes
	let libs = [];
	for (let item in config.libraries){
		libs.push({
			included: path.extname(config.libraries[item]) === '.js',
			pattern: path.join('./builds/client/libs/', path.basename(config.libraries[item]))
		});
	}
	
	//Setup karma configuration
	let server = new Karma({
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
			'karma-sourcemap-loader'
		],
		
		//Settings
		browsers: ['PhantomJS2'],
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
		files: [
			{ pattern: './karma.shim.js' }
		].concat(libs),
		preprocessors: { './karma.shim.js': ['webpack', 'sourcemap'] },
		
		//Webpack
		webpack: global.webpack,
	    webpackMiddleware: { stats: 'errors-only' },
		
		//Reporting
		reporters: ['mocha', 'junit', 'coverage'],
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
		
		//Beep to alert user
	    if (failed){
			beep(2);
		}else{
			beep();
		}
	    
	    done();
	}).start();
});

//Test client with karma
gulp.task('client.test.remap', function(done){
	return gulp.src('logs/coverage/client/coverage-final.json')
	.pipe(remap({
		useAbsolutePaths: true,
		reports: {
			json: 'logs/coverage/client/coverage-final.json',
			html: 'logs/coverage/client',
			clover: 'logs/coverage/client/clover.xml'
		}
	}))
	.on('end', () => {
		global.shutdown(done);
    });
});