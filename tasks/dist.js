//Modules
const gulp = require('gulp')
const shell = require('gulp-shell')
const del = require('del')

//Includes
const config = require('../config.js')

/*! Tasks 
- dist.clean
- dist.build

- dist.copy
- dist.copy.certs
- dist.copy.config
- dist.copy.server
*/

//Remove all distribution files
gulp.task('dist.clean', function(){
	return del('dist/**/*')
})

//Build and compress docker image for app
gulp.task('dist.build', shell.task([
	'docker build -t ' + config.name + ' $PWD',
	'docker save ' + config.name + ' > ' + config.name + '.tar',
	'zip ' + config.name + '.zip ' + config.name + '.tar',
	'rm -r ' + config.name + '.tar',
	'chmod +x server.sh'
],{
	verbose: true,
	cwd: 'dist'
}))

//! Copy
gulp.task('dist.copy', gulp.parallel(
	'dist.copy.config',
	'dist.copy.server'
))

//Copy config files
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
	.pipe(gulp.dest('dist'))
})

//Copy server executable files
gulp.task('dist.copy.server', function(){
	return gulp.src('builds/server/**/*')
		.pipe(gulp.dest('dist/server'))
})