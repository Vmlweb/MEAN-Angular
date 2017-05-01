//Modules
const gulp = require('gulp')
const del = require('del')
const tar = require('gulp-tar')
const zip = require('gulp-zip')
const shell = require('gulp-shell')

//Includes
const config = require('../config.js')
const docker = require('dockerode')(config.docker)

/*! Tasks 
- dist.clean

- dist.copy
- dist.copy.certs
- dist.copy.config
- dist.copy.server

- dist.build
- dist.build.packages
- dist.build.tar
- dist.build.docker
- dist.build.save
- dist.build.zip
- dist.build.clean
*/

//Remove distribution files
gulp.task('dist.clean', function(){
	return del('dist/**/*')
})

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

//! Build
gulp.task('dist.build', gulp.series(
	'dist.build.packages',
	'dist.build.tar',
	'dist.build.docker',
	'dist.build.save',
	'dist.build.zip',
	'dist.build.clean'
))

//Install production package dependancies
gulp.task('dist.build.packages', shell.task('npm i --production', {
	verbose: true,
	cwd: 'dist'
}))

//Compress dockerfile and context into tar
gulp.task('dist.build.tar', function(){
	return gulp.src('dist/**/*')
		.pipe(tar('Dockerfile.tar'))
		.pipe(gulp.dest('dist'))
})

//Generate docker image
gulp.task('dist.build.docker', function(done){
	docker.buildImage('./dist/Dockerfile.tar', { t: config.name + '_app' }, function (err, stream){
		if (err){ throw err }
		
		//Attach to pull progress
		stream.pipe(process.stdout)
        
		//Track pull progress
		docker.modem.followProgress(stream, function (err, output){
			if (err){ throw err }
			done()
		})
	})
})

//Save docker image to file
gulp.task('dist.build.save', shell.task('docker save ' + config.name + '_app > ' + config.name + '.tar', { cwd: 'dist' }))

//Compress docker image to zip
gulp.task('dist.build.zip', function(){
	return gulp.src('dist/' + config.name + '.tar')
		.pipe(zip(config.name + '.zip'))
		.pipe(gulp.dest('dist'))
})

//Remove large tar files used for building
gulp.task('dist.build.clean', function(){
	return del([
		'dist/' + config.name + '.tar',
		'dist/Dockerfile.tar',
		'dist/node_modules'
	])
})