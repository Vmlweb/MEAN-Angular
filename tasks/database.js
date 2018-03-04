//Modules
const gulp = require('gulp')
const del = require('del')
const fs = require('fs')
const async = require('async')
const path = require('path')

//Includes
const config = require('../config.js')
const docker = require('dockerode')(config.docker)
const name = config.name.replace(' ', '_').toLowerCase()

/*! Tasks
- database.clean
- database.start
- database.setup
- database.stop

- database.test
- database.test.clean
- database.test.start
*/

//Prepare command
const cmd = ['mongod', '--auth']

//Prepare replica parameters
if (config.database.repl.enabled){
	cmd.push('--keyFile', '/data/certs/' + config.database.repl.key, '--replSet', config.database.repl.name)
}

//Prepare ssl parameters
if (config.database.ssl.enabled){
	cmd.push('--sslMode', 'requireSSL', '--sslPEMKeyFile', '/data/certs/' + config.database.ssl.pem)
}

//Reset database volumes
gulp.task('database.clean', function(done){
	const container = docker.getContainer(name + '_db')
	const data = docker.getVolume(name + '_data')
	const conf = docker.getVolume(name + '_config')

	//Remove and create data volume
	container.remove(function(err){
		data.remove(function(err){
			docker.createVolume({ name: name + '_data' }, function(err){
				if (err){ throw err }

				//Remove and create config volume
				conf.remove(function(err){
					docker.createVolume({ name: name + '_config' }, function(err){
						if (err){ throw err }
						done()
					})
				})
			})
		})
	})
})

//Start database server
gulp.task('database.start', function(done){
	const container = docker.getContainer(name + '_db')
	container.inspect(function(err, info){
		if (info){

			//Start container
			container.start(function(err, data){
				if (err){ throw err }
				setTimeout(done, 1000)
			})

		}else{

			//Prepare volume bindings
			const binds = [
				name + '_data' + ':/data/db',
				name + '_config' + ':/data/configdb'
			]

			//Prepare platform specific bindings
			if (process.platform === 'win32'){
				binds.push('//' + process.cwd().replace(/\\/g, '/').replace(':', '/') + '/certs' + ':/data/certs')
			}else{
				binds.push(process.cwd() + '/certs' + ':/data/certs')
			}

			//Prepare container
			docker.createContainer({
				Hostname: config.database.repl.nodes[0].hostname,
				Image: 'mongo',
				Cmd: cmd,
				name: name + '_db',
				Volumes: {
					'/data/certs': {}
				},
				HostConfig: {
					Privileged: true,
					Binds: binds,
					PortBindings: {
						['27017/tcp']: [{ HostPort: config.database.repl.nodes[0].port.toString()}]
					}
				}
			}, function(err, container){
				if (err){ throw err }

				//Start container
				container.start(function(err, data){
					if (err){ throw err }
					setTimeout(done, 2000)
				})
			})
		}
	})
})

//Setup database server configuration
gulp.task('database.setup', function(done){
	setTimeout(function(){
		const container = docker.getContainer(name + '_db' + (process.env.NODE_ENV === 'testing' ? '_test' : ''))

		//Prepare command
		const cmd = ['mongo']

		//Prepare ssl parameters
		if (config.database.ssl.enabled){
			cmd.push('--ssl', '--sslAllowInvalidCertificates')
		}

		//Prepare command
		container.exec({
			Cmd: cmd,
			AttachStdin: true,
			AttachStdout: true,
			Tty: process.platform === 'win32'
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
				setTimeout(function(){
					fs.createReadStream('./builds/mongodb.js', 'binary').pipe(stream).on('end', function(){
						setTimeout(done, 500)
					})
				}, 500)
			})
		})
	}, 2000)
})

//Stop database server
gulp.task('database.stop', function(done){
	const container = docker.getContainer(name + '_db')
	const testing = docker.getContainer(name + '_db_test')
	container.stop({ t: 10 }, function(err, data){
		testing.stop({ t: 10 }, function(err, data){
			done()
		})
	})
})

//! Database Test
gulp.task('database.test', gulp.series(
	'database.test.clean',
	'database.test.start',
	'database.setup'
))

//Reset testing database volumes
gulp.task('database.test.clean', function(done){
	const container = docker.getContainer(name + '_db_test')
	const data = docker.getVolume(name + '_data_test')
	const conf = docker.getVolume(name + '_config_test')

	//Remove and create data volume
	container.remove(function(err){
		data.remove(function(err){
			docker.createVolume({ name: name + '_data_test' }, function(err){
				if (err){ throw err }

				//Remove and create config volume
				conf.remove(function(err){
					docker.createVolume({ name: name + '_config_test' }, function(err){
						if (err){ throw err }
						done()
					})
				})
			})
		})
	})
})

//Start testing database server
gulp.task('database.test.start', function(done){
	const container = docker.getContainer(name + '_db_test')
	container.inspect(function(err, info){
		if (info){

			//Start container
			container.start(function(err, data){
				if (err){ throw err }
				setTimeout(done, 1000)
			})

		}else{

			//Prepare volume bindings
			const binds = [
				name + '_data_test' + ':/data/db',
				name + '_config_test' + ':/data/configdb'
			]

			//Prepare platform specific bindings
			if (process.platform === 'win32'){
				binds.push('//' + process.cwd().replace(/\\/g, '/').replace(':', '/') + '/certs' + ':/data/certs')
			}else{
				binds.push(process.cwd() + '/certs' + ':/data/certs')
			}

			//Prepare container
			docker.createContainer({
				Hostname: config.database.repl.nodes[0].hostname,
				Image: 'mongo',
				Cmd: cmd,
				name: name + '_db_test',
				Volumes: {
					'/data/certs': {}
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

				//Start container
				container.start(function(err, stream){
					if (err){ throw err }
					setTimeout(done, 2000)
				})
			})
		}
	})
})
