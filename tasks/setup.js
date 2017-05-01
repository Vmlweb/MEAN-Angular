//Modules
const gulp = require('gulp')
const shell = require('gulp-shell')
const concat = require('gulp-concat')
const chmod = require('gulp-chmod')

//Includes
const config = require('../config.js')
const docker = require('dockerode')(config.docker)

/*! Tasks
- certs
- certs.generate
- certs.chmod

- install
- install.debian
- install.nodejs
*/

//! Certs
gulp.task('certs', gulp.series(
	'certs.generate'
))

//Prepare certificate subject string
const subj = '"/C=' + config.certs.details.country + '/ST=' + config.certs.details.state + '/L=' + config.certs.details.city + '/O=' + config.certs.details.organisation + '/CN=' + config.certs.details.hostname + '"'

//Prepare shell commands
const cmd = 'apt-get update; apt-get upgrade -y; apt-get install -y openssl; openssl req -new -newkey rsa:2048 -days 1825 -nodes -x509 -subj ' + subj + ' -keyout /data/certs/' + config.https.ssl.key + ' -out /data/certs/' + config.https.ssl.cert + '; ' + 'chown -R 999:999 /data/certs'

//Generate ssl certificate files
gulp.task('certs.generate', function(done){
	
	//Prepare platform specific bindings
	const binds = []
	if (process.platform === 'win32'){
		binds.push('//' + process.cwd().replace(/\\/g, '/').replace(':', '/') + '/certs' + ':/data/certs')
	}else{
		binds.push(process.cwd() + '/certs' + ':/data/certs')
	}
	
	//Execute container
	docker.run('debian', [ 'bash', '-c', cmd ], process.stdout, {
		Volumes: {
			'/data/certs': {}
		},
		HostConfig: {
			Privileged: true,
			Binds: binds
		}
	}, function (err) {
		if (err){ throw err }
		done()
	})
})

//! Install
gulp.task('install', gulp.series(
	'install.nodejs',
	'install.debian'
))

//Install debian docker image
gulp.task('install.debian', process.platform === 'win32' ? shell.task('docker pull debian:latest') : function(done){
	docker.pull('debian:latest', function (err, stream) {
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

//Install nodejs docker image
gulp.task('install.nodejs', process.platform === 'win32' ? shell.task('docker pull node:alpine') : function(done){
	docker.pull('node:alpine', function (err, stream) {
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