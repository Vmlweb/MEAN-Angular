//Modules
var gulp = require('gulp');
var path = require('path');
var del = require('del');
var docker = require('dockerode')();

//Config
var config = require('../config.js');

/*! Tasks 
- app.reset
- app.start
- app.test
- app.attach
- app.stop
*/

//! App Server

//Reset all app log files
gulp.task('app.reset', function(done){
	return del([
		'logs/**/*'
	]);
});

//Prepare ports
var internalPorts = {};
var externalPorts = {};

//HTTP ports
if (config.http.port.internal.length > 0){
	internalPorts[config.http.port.internal.toString() + '/tcp'] = {};
	if (config.http.port.external.length > 0){
		externalPorts[config.http.port.internal.toString() + '/tcp'] = [{ HostPort: config.http.port.external.toString()}];
	}
}

//HTTPS ports
if (config.https.port.internal.length > 0){
	internalPorts[config.https.port.internal.toString() + '/tcp'] = {};
	if (config.https.port.external.length > 0){
		externalPorts[config.https.port.internal.toString() + '/tcp'] = [{ HostPort: config.https.port.external.toString()}]
	}
}

//Start app server
gulp.task('app.start', function(done){
	
	//Prepare container
	docker.createContainer({
		Image: 'node:slim',
		WorkingDir: '/home',
		Cmd: ['node', '/home/server/app.js'],
		name: config.name + '_app',
		Tty: false,
		ExposedPorts: internalPorts,
		Env: [
			'NODE_ENV=development'
		]
	}, function(err, container) {
		if (err){ throw err; }
		
		//Start container
		container.start({
			Privileged: true,
			Binds: [
				path.join(process.cwd(), 'builds', 'server') + ':/home/server',
				path.join(process.cwd(), 'builds', 'client') + ':/home/client',
				path.join(process.cwd(), 'certs') + ':/home/certs',
				path.join(process.cwd(), 'logs') + ':/home/logs',
				path.join(process.cwd(), 'node_modules') + ':/home/node_modules',
				path.join(process.cwd(), 'config.js') + ':/home/config.js'
			],
			PortBindings: externalPorts
		}, function(err, data){
			if (err){ throw err; }
			done();
		});
	});
});

//Attach console to app server output
gulp.task('app.attach', function(done){
	var container = docker.getContainer(config.name + '_app');
	container.attach({
		stream: true,
		stdout: true,
		stderr: true
	}, function (err, stream) {
		if (err){ throw err; }
		
		//Stream output to console
        container.modem.demuxStream(stream, process.stdout, process.stderr);
        
        done();
	});
});

//Stop app server
gulp.task('app.stop', function(done){
	var container = docker.getContainer(config.name + '_app');
	container.stop({ t: 5 }, function(err, data){
		container.remove({ force: true }, function(err, data){
			done();
		});
	});
});