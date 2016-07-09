//Modules
const gulp = require('gulp');
const shell = require('gulp-shell');
const del = require('del');
const docker = require('dockerode')();

//Config
let config = require('../config.js');

/*! Tasks 
- dist.reset
- dist.build

- dist.copy
- dist.copy.certs
- dist.copy.config
- dist.copy.server
- dist.copy.client
*/

//Remove all dist files
gulp.task('dist.reset', function(){
	return del([
		'dist/**/*'
	]);
});

//Build the docker images and app
gulp.task('dist.build', shell.task([
	'docker build -t ' + config.name + '_app $PWD',
	'docker save ' + config.name + '_app > ' + config.name + '_app.tar',
	'zip ' + config.name + '_app.zip ' + config.name + '_app.tar',
	'rm -r ' + config.name + '_app.tar',
	'chmod +x server.sh'
],{
	verbose: true,
	cwd: 'dist'
}));

//! Copy
gulp.task('dist.copy', gulp.parallel('dist.copy.config', 'dist.copy.server', 'dist.copy.client'));

//Copy over config files
gulp.task('dist.copy.config', function(){
	return gulp.src([
		'builds/config.js',
		'builds/package.json',
		'builds/Dockerfile',
		'builds/docker-compose.yml',
		'builds/mongodb.js',
		'builds/server.sh',
		'builds/database.sh'
	])
	.pipe(gulp.dest('dist'));
});

//Copy over server source files
gulp.task('dist.copy.server', function(){
	return gulp.src([
		'builds/server/**/*',
		'!builds/server/tests/*',
		'!builds/server/**/*.js.map',
		'!builds/server/**/*.min.map',
		'!builds/server/**/*.test.js',
		'!builds/server/**/*.test.json'
	])
	.pipe(gulp.dest('dist/server'));
});

//Copy over client source files
gulp.task('dist.copy.client', function(){
	return gulp.src([
		'builds/client/**/*',
		'!builds/client/tests/*',
		'!builds/client/**/*.js.map',
		'!builds/client/**/*.min.map',
		'!builds/client/**/*.test.js',
		'!builds/client/**/*.test.json'
	])
	.pipe(gulp.dest('dist/client'));
});