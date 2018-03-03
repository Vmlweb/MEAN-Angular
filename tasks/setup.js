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
- certs.merge
- certs.chmod

- install
- install.nodejs
- install.mongodb
*/

//! Certs
gulp.task('certs', gulp.series(
	'certs.generate',
	'certs.merge',
	'certs.chmod'
))

//Prepare certificate subject string
const subj = '"/C=' + config.certs.details.country + '/ST=' + config.certs.details.state + '/L=' + config.certs.details.city + '/O=' + config.certs.details.organisation + '/CN=' + config.certs.details.hostname + '"'

//Prepare shell commands
const cmd = 'apt-get update; apt-get upgrade -y; apt-get install -y openssl; openssl req -new -newkey rsa:2048 -days 1825 -nodes -x509 -subj ' + subj + ' -keyout /data/certs/' + config.https.ssl.key + ' -out /data/certs/' + config.https.ssl.cert + '; openssl req -new -newkey rsa:2048 -days 1825 -nodes -x509 -subj ' + subj + ' -keyout /data/certs/' + config.database.ssl.key + ' -out /data/certs/' + config.database.ssl.cert + ';' + ' openssl rand -base64 741 > /data/certs/' + config.database.repl.key + '; ' + 'chown -R 999:999 /data/certs'

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
	docker.run('mongo', [ 'bash', '-c', cmd ], process.stdout, {
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

//Merge database certs toggether for pem
gulp.task('certs.merge', function(){
	return gulp.src([ 'certs/' + config.database.ssl.key, 'certs/' + config.database.ssl.cert ])
		.pipe(concat(config.database.ssl.pem))
		.pipe(gulp.dest('certs'))
})

//Configure permissions for database cert
gulp.task('certs.chmod', function(){
	return gulp.src('certs/' + config.database.repl.key)
		.pipe(chmod({
			owner: { read: true, write: true, execute: false },
			group: { read: false, write: false, execute: false },
			others: { read: false, write: false, execute: false }
		}))
		.pipe(gulp.dest('certs'))
})

//! Install
gulp.task('install', gulp.series(
	'install.nodejs',
	'install.mongodb'
))

//Install mongodb docker image
gulp.task('install.mongodb', process.platform === 'win32' ? shell.task('docker pull mongo:latest') : function(done){
	docker.pull('mongo:latest', function (err, stream) {
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
