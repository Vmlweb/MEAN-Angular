//Modules
const gulp = require('gulp')
const path = require('path')
const del = require('del')

//Includes
const config = require('../config.js')
const docker = require('dockerode')(config.docker)

/*! Tasks 
- app.clean
- app.start
- app.stop
*/

//Remove all app log files
gulp.task('app.clean', function(){
	return del('logs/**/*')
})

//Start app server
gulp.task('app.start', function(done){
	
	//Prepare ports
	const internalPorts = {}
	const externalPorts = {}
	
	//HTTP ports
	if (config.http.port.internal.length > 0){
		internalPorts[config.http.port.internal.toString() + '/tcp'] = {}
		if (config.http.port.external.length > 0){
			externalPorts[config.http.port.internal.toString() + '/tcp'] = [{ HostPort: config.http.port.external.toString()}]
		}
	}
	
	//HTTPS ports
	if (config.https.port.internal.length > 0){
		internalPorts[config.https.port.internal.toString() + '/tcp'] = {}
		if (config.https.port.external.length > 0){
			externalPorts[config.https.port.internal.toString() + '/tcp'] = [{ HostPort: config.https.port.external.toString()}]
		}
	}
	
	//Prepare container
	docker.createContainer({
		Image: 'node:slim',
		WorkingDir: '/home',
		Cmd: [ 'node', '/home/server/main.js' ],
		name: config.name + '_app',
		Tty: false,
		ExposedPorts: internalPorts,
		Env: [ 'NODE_ENV=development' ],
		HostConfig: {
			Privileged: true,
			Binds: [
				path.join(process.cwd(), 'builds', 'server') + ':/home/server',
				path.join(process.cwd(), 'certs') + ':/home/certs',
				path.join(process.cwd(), 'logs') + ':/home/logs',
				path.join(process.cwd(), 'node_modules') + ':/home/node_modules',
				path.join(process.cwd(), 'config.js') + ':/home/config.js'
			],
			PortBindings: externalPorts
		}
	}, function(err, container) {
		if (err){ throw err }
		
		//Attach to container
		container.attach({
			stream: true,
			stdout: true,
			stderr: true
		}, function (err, stream) {
			if (err){ throw err }
			
			//Stream output to console
	        container.modem.demuxStream(stream, process.stdout, process.stderr)
		})
		
		//Start container
		container.start(function(err, data){
			if (err){ throw err }
			done()
		})
	})
})

//Stop app server
gulp.task('app.stop', function(done){
	const container = docker.getContainer(config.name + '_app')
	container.stop({ t: 5 }, function(err, data){
		container.remove({ force: true }, function(err, data){
			done()
		})
	})
})