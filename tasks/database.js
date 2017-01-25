//Modules
const gulp = require('gulp')
const del = require('del')
const fs = require('fs')
const async = require('async')
const path = require('path')

//Includes
const config = require('../config.js')
const docker = require('dockerode')(config.docker)

/*! Tasks 
- database.clean
- database.start
- database.test
- database.setup
- database.stop
*/

//Remove all database files
gulp.task('database.clean', function(){
	return del('data/**/*')
})

//Prepare command
const cmd = ['mongod', '--auth']
if (process.platform !== 'win32' && config.database.repl.enabled){
	cmd.push('--keyFile', '/home/certs/' + config.database.repl.key, '--replSet', config.database.repl.name)
}

//Prepare SSL
if (config.database.ssl.enabled){
	cmd.push('--sslMode', 'requireSSL', '--sslPEMKeyFile', '/home/certs/' + config.database.ssl.pem)
}

//Reset database volume, windows workaround
gulp.task('database.start.volume', function(done){
	if (process.platform === 'win32'){
		const volume = docker.getVolume(config.name + '_data')
		
		//Remove existing and create new volume
		volume.remove(function(err){
			docker.createVolume({
				name: config.name + '_data'
			}, function(err){
				if (err){ throw err }
				done()
			})
		})
		
	}else{
		done()
	}
})

//Start database server
gulp.task('database.start', function(done){
	
	//Prepare volume bindings
	const binds = []
	if (process.platform === 'win32'){
		binds.push(config.name + '_data' + ':/data/db')
		binds.push('//' + process.cwd().replace(/\\/g, '/').replace(':', '/') + '/certs' + ':/home/certs')
	}else{
		binds.push(process.cwd() + '/data' + ':/data/db')
		binds.push(process.cwd() + '/certs' + ':/home/certs')
	}
	
	//Prepare container
	docker.createContainer({
		Hostname: config.database.repl.nodes[0].hostname,
		Image: 'mongo',
		Cmd: cmd,
		name: config.name + '_db',
		Volumes: {
			'/home/certs': {}
		},
		HostConfig: {
			Privileged: true,
			Binds: binds,
			PortBindings: {
				['27017/tcp']: [{ HostPort: config.database.repl.nodes[0].port.toString()}]
			}
		}
	}, function(err, container) {
		if (err){ throw err }
		
		//Attach to container errors
		container.attach({
			stream: true,
			stderr: true
		}, function (err, stream) {
			if (err){ throw err }
			
			//Stream output to console
	        container.modem.demuxStream(stream, process.stdout, process.stderr)
		})
		
		//Start container
		container.start(function(err, data){
			if (err){ throw err }
			setTimeout(done, 1000)
		})
	})
})

//Reset testing database volume
gulp.task('database.test.volume', function(done){
	const volume = docker.getVolume(config.name + '_test')
		
	//Remove existing and create new volume
	volume.remove(function(err){
		docker.createVolume({
			name: config.name + '_test'
		}, function(err){
			if (err){ throw err }
			done()
		})
	})
})

//Start testing database server
gulp.task('database.test', function(done){
	
	//Prepare volume bindings
	const binds = []
	if (process.platform === 'win32'){
		binds.push(config.name + '_test' + ':/data/db')
		binds.push('//' + process.cwd().replace(/\\/g, '/').replace(':','/') + '/certs' + ':/home/certs')
	}else{
		binds.push(config.name + '_test' + ':/data/db')
		binds.push(process.cwd() + '/certs' + ':/home/certs')
	}
	
	//Prepare container
	docker.createContainer({
		Hostname: config.database.repl.nodes[0].hostname,
		Image: 'mongo',
		Cmd: cmd,
		name: config.name + '_db',
		Volumes: {
			'/home/certs': {}
		},
		HostConfig: {
			Privileged: true,
			Binds: binds,
			PortBindings: {
				['27017/tcp']: [{ HostPort: config.database.repl.nodes[0].port.toString()}]
			}
		}
	}, function(err, container) {
		if (err){ throw err }
		
		//Attach to container errors
		container.attach({
			stream: true,
			stderr: true
		}, function (err, stream) {
			if (err){ throw err }
			
			//Stream output to console
	        container.modem.demuxStream(stream, process.stdout, process.stderr)
		})
		
		//Start container
		container.start(function(err, stream){
			if (err){ throw err }
			setTimeout(done, 500)
		})
	})
})

//Setup database server configuration
gulp.task('database.setup', function(done){
	const container = docker.getContainer(config.name + '_db')
	
	//Prepare command
	const cmd = ['mongo']
	
	//Prepare SSL
	if (config.database.ssl.enabled){
		cmd.push('--ssl', '--sslAllowInvalidCertificates')
	}
	
	//Prepare command
	container.exec({
		Cmd: cmd,
		AttachStdin: true,
		AttachStdout: true,
		Tty: true
	}, function(err, exec) {
		if (err){ throw err }
		
		//Execute command
		exec.start({
			hijack: true,
			stdin: true,
			stdout: true
		}, function(err, stream) {
			if (err){ throw err }
				
			//Stream output to console
	        container.modem.demuxStream(stream, process.stdout, process.stderr)
				
			//Stream file into container mongo cli
			fs.createReadStream('./builds/mongodb.js', 'binary').pipe(stream).on('end', function(){
				setTimeout(done, 500)
			})
		})
	})
})


//Stop database server
gulp.task('database.stop', function(done){
	const container = docker.getContainer(config.name + '_db')
	container.stop({ t: 5 }, function(err, data){
		container.remove({ force: true }, function(err, data){
			done()
		})
	})
})