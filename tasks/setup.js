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
- install.bower
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

//Prepare openssl location
const openssl = process.platform === 'win32' ? 'C:\\OpenSSL-Win' + (process.arch.indexOf('64') > -1 ? '64' : '32') + '\\bin\\openssl.exe' : 'openssl'

//Prepare shell commands
const cmd = [
	openssl + ' req -new -newkey rsa:2048 -days 1825 -nodes -x509 -subj ' + subj + ' -keyout ' + config.https.ssl.key + ' -out ' + config.https.ssl.cert,
	openssl + ' req -new -newkey rsa:2048 -days 1825 -nodes -x509 -subj ' + subj + ' -keyout ' + config.database.ssl.key + ' -out ' + config.database.ssl.cert,
	openssl + ' rand -base64 741 > ' + config.database.repl.key
]

//Prepare chown for linux only
if (process.platform === 'linux'){
	cmd.push('chown -R 999:999 ../certs')
}

//Generate ssl certificate files
gulp.task('certs.generate', shell.task(cmd, {
	ignoreErrors: true,
	verbose: true,
	cwd: 'certs'
}))

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
	'install.bower',
	'install.nodejs',
	'install.mongodb'
))

//Install bower dependancies
gulp.task('install.bower', shell.task('bower install --config.analytics=false --allow-root', { verbose: true }))

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