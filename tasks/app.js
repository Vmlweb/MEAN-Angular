//Modules
const gulp = require('gulp')
const path = require('path')
const del = require('del')

//Includes
const config = require('../config.js')
const docker = require('dockerode')(config.docker)
const name = config.name.replace(' ', '_').toLowerCase()

/*! Tasks
- app.clean
- app.start
- app.stop
- app.restart
*/

//Remove app log files
gulp.task('app.clean', function(){

	//Remove and create data volume
	const container = docker.getContainer(name)
	container.remove(function(err){})

	//Clear logs directory
	return del('logs/**/*')
})

//Start app server
gulp.task('app.start', function(done){
	const container = docker.getContainer(name)
	container.inspect(function(err, info){
		if (info){

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

		}else{

			//Prepare ports
			const internalPorts = {}
			const externalPorts = {}

			//HTTP ports
			if (config.http.port.internal.toString().length > 0){
				internalPorts[config.http.port.internal.toString() + '/tcp'] = {}
				if (config.http.port.external.toString().length > 0){
					externalPorts[config.http.port.internal.toString() + '/tcp'] = [{ HostPort: config.http.port.external.toString()}]
				}
			}

			//HTTPS ports
			if (config.https.port.internal.toString().length > 0){
				internalPorts[config.https.port.internal.toString() + '/tcp'] = {}
				if (config.https.port.external.toString().length > 0){
					externalPorts[config.https.port.internal.toString() + '/tcp'] = [{ HostPort: config.https.port.external.toString()}]
				}
			}

			//Prepare volume bindings
			const binds = []
			if (process.platform === 'win32'){
				const prefix = '//' + process.cwd().replace(/\\/g, '/').replace(':','/')
				binds.push(prefix + '/builds/server' + ':/data/server')
				binds.push(prefix + '/builds/client' + ':/data/client')
				binds.push(prefix + '/certs' + ':/data/certs')
				binds.push(prefix + '/logs' + ':/data/logs')
				binds.push(prefix + '/node_modules' + ':/data/node_modules')
				binds.push(prefix + '/config.js' + ':/data/config.js')
				binds.push(prefix + '/tasks/reload.js' + ':/data/reload.js')
			}else{
				binds.push(process.cwd() + '/builds/server' + ':/data/server')
				binds.push(process.cwd() + '/builds/client' + ':/data/client')
				binds.push(process.cwd() + '/certs' + ':/data/certs')
				binds.push(process.cwd() + '/logs' + ':/data/logs')
				binds.push(process.cwd() + '/node_modules' + ':/data/node_modules')
				binds.push(process.cwd() + '/config.js' + ':/data/config.js')
				binds.push(process.cwd() + '/tasks/reload.js' + ':/data/reload.js')
			}

			//Prepare container
			docker.createContainer({
				Image: 'node:alpine',
				WorkingDir: '/data',
				Cmd: [ 'node', 'reload.js' ],
				name: name,
				Tty: false,
				ExposedPorts: internalPorts,
				Env: [ 'NODE_ENV=development' ],
				HostConfig: {
					Privileged: true,
					Binds: binds,
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
	}
	})
})

//Stop app server
gulp.task('app.stop', function(done){
	const container = docker.getContainer(name)
	container.stop({ t: 10 }, function(err, data){
		done()
	})
})
