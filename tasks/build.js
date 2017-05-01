//Modules
const gulp = require('gulp')
const del = require('del')
const shell = require('gulp-shell')
const path = require('path')
const replace = require('gulp-replace')

//Includes
const config = require('../config.js')

/*! Tasks
- build.clean

- build.config
- build.config.nodejs
- build.config.docker
*/

//Remove all build files
gulp.task('build.clean', function(){
	return del('builds/**/*')
})

//! Build Config
gulp.task('build.config', gulp.parallel(
	'build.config.nodejs',
	'build.config.docker'
))

//Copy nodejs config files
gulp.task('build.config.nodejs', function(){
	return gulp.src([ 'config.js', 'package.json' ])
		.pipe(gulp.dest('builds'))
})

//Copy and replace docker files
gulp.task('build.config.docker', function(){
	
	//Prepare port dumps
	const mappedPorts = []
	
	//HTTP port mappings
	if (config.http.port.internal.length > 0){
		if (config.http.port.external.length > 0){
			
			//Internal and external port mappings
			mappedPorts.push(config.http.port.external.toString() + ':' + config.http.port.internal.toString())
		}else{
			
			//Only internal port mappings
			mappedPorts.push(config.http.port.external.toString() + ':' + config.http.port.internal.toString())
		}
	}
	
	//HTTPS port mappings
	if (config.https.port.internal.length > 0){
		if (config.https.port.external.length > 0){		
				
			//Internal and external port mappings
			mappedPorts.push(config.https.port.external.toString() + ':' + config.https.port.internal.toString())
		}else{
			
			//Only internal port mappings
			mappedPorts.push(config.https.port.external.toString() + ':' + config.https.port.internal.toString())
		}
	}
	
	//Docker run commands
	let dockerConfig = ''
	if (mappedPorts.length > 0){
		dockerConfig = '-p ' + mappedPorts.join(' -p ')
	}
	
	//Compose port cofig
	let composeConfig = ''
	if (mappedPorts.length > 0){
		composeConfig = '    - ' + mappedPorts.join('\r\n    - ')
	}
	
	//Build files
	return gulp.src([ 'Dockerfile', 'docker-compose.yml', 'server.sh' ])
		.pipe(replace('@@NAME', config.name))
		.pipe(replace('@@VERSION', config.version))
		.pipe(replace('@@BUILD', config.build))
		.pipe(replace('@@DOCKER_CONFIG', dockerConfig))
		.pipe(replace('@@COMPOSE_CONFIG', composeConfig))
		.pipe(replace('@@CONFIG', config.config))
		.pipe(replace('@@LOGS_PATH', config.logs.path))
		.pipe(replace('@@CERTS_PATH', config.certs.path))
		.pipe(replace('@@HTTP_PORT_INTERNAL', config.http.port.internal))
		.pipe(replace('@@HTTPS_PORT_INTERNAL', config.https.port.internal))
		.pipe(replace('@@HTTP_PORT_EXTERNAL', config.http.port.external))
		.pipe(replace('@@HTTPS_PORT_EXTERNAL', config.https.port.external))
		.pipe(gulp.dest('builds'))
})