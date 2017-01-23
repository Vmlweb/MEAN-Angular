//Modules
const gulp = require('gulp')
const shell = require('gulp-shell')
const del = require('del')
const docker = require('dockerode')()

//Includes
const config = require('../config.js')

/*! Tasks 
- dist.clean
- dist.build

- dist.build
- dist.build.docker
- dist.build.zip
- dist.build.clean

- dist.copy
- dist.copy.certs
- dist.copy.config
- dist.copy.server
- dist.copy.client
*/

//Remove all distribution files
gulp.task('dist.clean', function(){
	return del('dist/**/*')
})

//! Build
gulp.task('dist.build', gulp.series(
	'dist.build.docker',
	'dist.build.zip',
	'dist.build.clean'
))

//Generate docker image
gulp.task('dist.build.docker', function(){
	docker.buildImage(config.name + '.tar', {
		t: config.name + '_app'
	}, function (err, response){
		done(err)
	})
}, {
	cwd: 'dist'
})

//Compress docker image to zip
gulp.task('dist.build.zip', function(){
	return gulp.src(config.name + '.tar')
		.pipe(gulp.dest('./'))
}, {
	cwd: 'dist'
})

//Remove non compressed docker image
gulp.task('dist.build.clean', function(){
	return del('dist/' + config.name + '.tar')
})

//! Copy
gulp.task('dist.copy', gulp.parallel(
	'dist.copy.config',
	'dist.copy.server',
	'dist.copy.client'
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

//Copy client executable files
gulp.task('dist.copy.client', function(){
	return gulp.src('builds/client/**/*')
		.pipe(gulp.dest('dist/client'))
})