//Modules
const gulp = require('gulp')
const del = require('del')
const fs = require('fs')
const async = require('async')
const path = require('path')
const docker = require('dockerode')()

//Includes
const config = require('../config.js')

/*! Tasks 
- database.clean
- database.start
- database.test
- database.setup
- database.stop
*/

//Remove all database files
gulp.task('database.clean', function(t){
	return del('data/**/*')
})

//Prepare command
let cmd = ['mongod', '--auth', '--keyFile', path.join('/home/certs/', config.database.repl.key), '--replSet', config.database.repl.name]

//Prepare SSL
if (config.database.ssl.enabled){
	cmd.push('--sslMode')
	cmd.push('requireSSL')
	cmd.push('--sslPEMKeyFile')
	cmd.push(path.join('/home/certs/', config.database.ssl.pem))
}

//Start database server
gulp.task('database.start', function(done){
	
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
			Binds: [
				path.join(process.cwd(), 'data') + ':/data/db',
				path.join(process.cwd(), 'certs') + ':/home/certs'
			],
			PortBindings: {
				['27017/tcp']: [{ HostPort: config.database.repl.nodes[0].port.toString()}]
			}
		}
	}, function(err, container) {
		if (err){ throw err }
		
		//Start container
		container.start(function(err, data){
			if (err){ throw err }
			setTimeout(done, 500)
		})
	})
})

//Start testing database server
gulp.task('database.test', function(done){
	
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
			Binds: [
				path.join(process.cwd(), 'certs') + ':/home/certs'
			],
			PortBindings: {
				['27017/tcp']: [{ HostPort: config.database.repl.nodes[0].port.toString()}]
			}
		}
	}, function(err, container) {
		if (err){ throw err }
		
		//Start container
		container.start(function(err, data){
			if (err){ throw err }
			setTimeout(done, 500)
		})
	})
})

//Setup database server configuration
gulp.task('database.setup', function(done){
	let container = docker.getContainer(config.name + '_db')
	
	//Prepare command
	let cmd = ['mongo']
	
	//Prepare SSL
	if (config.database.ssl.enabled){
		cmd.push('--ssl')
		cmd.push('--sslAllowInvalidCertificates')
	}
	
	//Prepare command
	container.exec({
		Cmd: cmd,
		AttachStdin: true,
		AttachStdout: true,
		Tty: false
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
			fs.createReadStream('builds/mongodb.js', 'binary').pipe(stream).on('end', function(){
				done()
			})
		})
	})
})


//Stop database server
gulp.task('database.stop', function(done){
	let container = docker.getContainer(config.name + '_db')
	container.stop({ t: 5 }, function(err, data){
		container.remove({ force: true }, function(err, data){
			done()
		})
	})
})