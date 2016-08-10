//Modules
const gulp = require('gulp');
const del = require('del');
const shell = require('gulp-shell');
const path = require('path');
const replace = require('gulp-replace');
const config = require('../config.js');

/*! Tasks 
- build.reset
- build.semantic

- build.config
- build.config.nodejs
- build.config.mongodb
- build.config.docker
*/

//Remove all build files
gulp.task('build.reset', function(){
	return del([
		'builds/**/*'
	]);
});

//Build semantic ui and themes
gulp.task('build.semantic', shell.task([
	'gulp build'
],{
	verbose: true,
	cwd: 'node_modules/semantic-ui'
}));

//! Config
gulp.task('build.config', gulp.parallel(
	'build.config.nodejs',
	'build.config.mongodb',
	'build.config.docker'
));

//Build node config file
gulp.task('build.config.nodejs', function(){
	return gulp.src([
		'config.js',
		'package.json'
	])
	.pipe(gulp.dest('builds'));
});

//Build mongodb.js file
gulp.task('build.config.mongodb', function(){
	
	//Generate random password
	let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let password = Array.apply(null, Array(70)).map(function() { return chars.charAt(Math.floor(Math.random() * chars.length)); }).join('');
	
	return gulp.src('mongodb.js')
		.pipe(replace('@@DATABASE_ADMIN_PASSWORD', password))
		.pipe(replace('@@DATABASE_REPL_NAME', config.database.repl.name))
		.pipe(replace('@@DATABASE_REPL_NODES_HOSTNAME', config.database.repl.nodes[0].hostname))
		.pipe(replace('@@DATABASE_REPL_NODES_PORT', config.database.repl.nodes[0].port))
		.pipe(replace('@@DATABASE_AUTH_USERNAME', config.database.auth.username))
		.pipe(replace('@@DATABASE_AUTH_PASSWORD', config.database.auth.password))
		.pipe(replace('@@DATABASE_AUTH_DATABASE', config.database.auth.database))
		.pipe(gulp.dest('builds'));
});

//Build docker file
gulp.task('build.config.docker', function(){
	
	//Prepare port dumps
	let mappedPorts = [];
	
	//HTTP port mappings
	if (config.http.port.internal.length > 0){
		if (config.http.port.external.length > 0){
			//Internal and external port mappings
			mappedPorts.push(config.http.port.external.toString() + ':' + config.http.port.internal.toString());
		}else{
			//Only internal port mappings
			mappedPorts.push(config.http.port.external.toString() + ':' + config.http.port.internal.toString());
		}
	}
	
	//HTTPS port mappings
	if (config.https.port.internal.length > 0){
		if (config.https.port.external.length > 0){			
			//Internal and external port mappings
			mappedPorts.push(config.https.port.external.toString() + ':' + config.https.port.internal.toString());
		}else{
			//Only internal port mappings
			mappedPorts.push(config.https.port.external.toString() + ':' + config.https.port.internal.toString());
		}
	}
	
	//Docker run commands
	let dockerConfig = '';
	if (mappedPorts.length > 0){
		dockerConfig = '-p ' + mappedPorts.join(' -p ');
	}
	
	//Compose port cofig
	let composeConfig = '';
	if (mappedPorts.length > 0){
		composeConfig = '    - ' + mappedPorts.join('\r\n    - ');
	}
	
	//MongoDB ssl config
	let mongoConfig = '';
	if (config.database.ssl.enabled){
		mongoConfig = '--sslMode requireSSL --sslPEMKeyFile ' + path.join('/home/certs/', config.database.ssl.pem);
	}
	
	//Build files
	return gulp.src([
		'Dockerfile',
		'docker-compose.yml',
		'database.sh',
		'server.sh'
	])
	.pipe(replace('@@NAME', config.name))
	.pipe(replace('@@VERSION', config.version))
	.pipe(replace('@@BUILD', config.build))
	.pipe(replace('@@MONGO_CONFIG', mongoConfig))
	.pipe(replace('@@DOCKER_CONFIG', dockerConfig))
	.pipe(replace('@@COMPOSE_CONFIG', composeConfig))
	.pipe(replace('@@CONFIG', config.config))
	.pipe(replace('@@LOGS_PATH', config.logs.path))
	.pipe(replace('@@CERTS_PATH', config.certs.path))
	.pipe(replace('@@DATABASE_PATH', config.database.path))
	.pipe(replace('@@DATABASE_REPL_NAME', config.database.repl.name))
	.pipe(replace('@@DATABASE_REPL_NODES_PORT', config.database.repl.nodes[0].port))
	.pipe(replace('@@DATABASE_REPL_KEY', config.database.repl.key))
	.pipe(replace('@@HTTP_PORT_INTERNAL', config.http.port.internal))
	.pipe(replace('@@HTTPS_PORT_INTERNAL', config.https.port.internal))
	.pipe(replace('@@HTTP_PORT_EXTERNAL', config.http.port.external))
	.pipe(replace('@@HTTPS_PORT_EXTERNAL', config.https.port.external))
	.pipe(gulp.dest('builds'));
});