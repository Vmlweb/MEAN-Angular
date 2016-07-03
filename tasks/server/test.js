//Modules
var gulp = require('gulp');
var path = require('path');
var beep = require('beepbeep');
var jasmine = require('gulp-jasmine');
var sreporter = require('jasmine-spec-reporter');
var jreporter = require('jasmine-reporters');
var istanbul = require('gulp-istanbul');

//Config
var config = require('../../config.js');

/*! Tasks 
- server.test

- server.test.coverage
- server.test.jasmine
*/

//! Test
gulp.task('server.test', gulp.series(
	'env.test',
	'stop',
	'clean',
	gulp.parallel('server.build', 'build.config'),
	'database.test',
	'database.reset.config',
	'server.test.coverage',
	'server.test.jasmine',
	'stop'
));

//Insert coverage hooks
gulp.task('server.test.coverage', function(){
	var includes = [];
	
	//Check if using a test plan
	if (process.env.hasOwnProperty('test') && process.env.test.length > 0){
		for (i in config.tests[process.env.test]){
			var tests = config.tests[process.env.test][i];
			includes.push(path.join('builds/server', tests, '*.js'));
			includes.push(path.join('!builds/server', tests, '*.test.js'));
		}
	}else{
		includes = includes.concat([
			'builds/server/api/**/*.js',
			'!builds/server/api/**/*.test.js'
		]);
	}
	
	return gulp.src(includes)
	.pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

//Test server with jasmine
gulp.task('server.test.jasmine', function(done){
	var includes = [];
	
	//Check if using a test plan
	if (process.env.hasOwnProperty('test') && process.env.test.length > 0){
		for (i in config.tests[process.env.test]){
			var tests = config.tests[process.env.test][i];
			includes.push(path.join('builds/server', tests, '*.test.js'));
		}
	}else{
		includes = includes.concat([
			'builds/server/tests/*.test.js',
			'builds/server/**/*.test.js'
		]);
	}
	
	//Execute tests and generate coverage reports
	gulp.src([
		'builds/server/tests/setup.test.js'
	].concat(includes))
	.pipe(jasmine({
		reporter: [
			new sreporter({
				displayStacktrace: 'all'
			}),
			new jreporter.JUnitXmlReporter({
				savePath: 'logs/tests/server',
				consolidateAll: false
			})
		]
	}))
	.on('error', (err) => {
		beep(2);
		setTimeout(() => {
			done(err);
		}, 500);
    })
	.pipe(istanbul.writeReports({
		dir: 'logs/coverage/server',
		reporters: ['html', 'text-summary', 'clover', 'json']
	}))
	.on('end', () => {
		beep();
		done();
    });
});