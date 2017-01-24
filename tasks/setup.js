//Modules
const gulp = require('gulp')
const shell = require('gulp-shell')
const concat = require('gulp-concat')
const chmod = require('gulp-chmod')

//Includes
const config = require('../config.js')
const docker = require('dockerode')(config.docker)

/*! Tasks 
- setup.clean
- setup.certs
	
- setup.install
- setup.install.bower
- setup.install.nodejs
- setup.install.mongodb
- setup.install.npm
- setup.install.semantic
*/

//Clean docker volumes
//gulp.task('setup.clean', shell.task('docker volume rm $(docker volume ls -qf dangling=true) || true', { verbose: true }))
gulp.task('setup.clean', function(done){
	done()
})

//! Certs
gulp.task('setup.certs', gulp.series('setup.certs.generate', 'setup.certs.merge', 'setup.certs.chmod'))

//Prepare certificate subject string
const subj = '"/C=' + config.certs.details.country + '/ST=' + config.certs.details.state + '/L=' + config.certs.details.city + '/O=' + config.certs.details.organisation + '/CN=' + config.certs.details.hostname + '"'

//Generate ssl certificate files
gulp.task('setup.certs.generate', shell.task([
	'openssl req -new -newkey rsa:2048 -days 1825 -nodes -x509 -subj ' + subj + ' -keyout ' + config.https.ssl.key + ' -out ' + config.https.ssl.cert,
	'openssl req -new -newkey rsa:2048 -days 1825 -nodes -x509 -subj ' + subj + ' -keyout ' + config.database.ssl.key + ' -out ' + config.database.ssl.cert,
	'openssl rand -base64 741 > ' + config.database.repl.key,
],{
	verbose: true,
	cwd: 'certs'
}))

//Merge database certs toggether for pem
gulp.task('setup.certs.merge', function(){
	return gulp.src([ 'certs/' + config.database.ssl.key, 'certs/' + config.database.ssl.cert ])
		.pipe(concat(config.database.ssl.pem))
		.pipe(gulp.dest('certs'))
})

//Configure permissions for database cert
gulp.task('setup.certs.chmod', function(){
	return gulp.src('certs/' + config.database.repl.key)
		.pipe(chmod({
			owner: {
				read: true,
				write: true,
				execute: false
			},
			group: {
				read: false,
				write: false,
				execute: false
			},
			others: {
				read: false,
				write: false,
				execute: false
			}
		}))
		.pipe(gulp.dest('certs'))
})

//! Installations
gulp.task('setup.install', gulp.parallel(
	'setup.install.bower',
	'setup.install.nodejs',
	'setup.install.mongodb',
	gulp.series('setup.install.npm', 'setup.install.semantic')
))

//Install npm dependancies
gulp.task('setup.install.npm', shell.task('npm install --save-dev --ignore-scripts semantic-ui', { verbose: true }))

//Install semantic dependancies
gulp.task('setup.install.semantic', shell.task([
	'npm install --production',
	'gulp install'
],{
	verbose: true,
	cwd: 'node_modules/semantic-ui'
}))

//Install bower dependancies
gulp.task('setup.install.bower', shell.task('bower install --config.analytics=false', { verbose: true }))

//Install mongodb docker image
gulp.task('setup.install.mongodb', function(done){
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
gulp.task('setup.install.nodejs', function(done){
	docker.pull('node:slim', function (err, stream) {
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