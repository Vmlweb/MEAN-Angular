//Modules
const gulp = require('gulp');
const shell = require('gulp-shell');
const docker = require('dockerode')();
const config = require('../config.js');

/*! Tasks 
- setup.dependant
- setup.dependant.npm
- setup.dependant.semantic
- setup.dependant.bower

- setup.typings
- setup.typings.server
- setup.typings.client

- setup.docker
- setup.docker.nodejs
- setup.docker.mongodb

- setup.certs

- setup.clean
*/

//! Dependancies
gulp.task('setup.dependant', gulp.series(
	gulp.series('setup.dependant.npm'),
	gulp.parallel('setup.dependant.semantic', 'setup.dependant.bower')
));

//Install npm dependancies
gulp.task('setup.dependant.npm', shell.task([
	'npm install --save-dev --ignore-scripts semantic-ui',
],{
	verbose: true
}));


//Install semantic dependancies
gulp.task('setup.dependant.semantic', shell.task([
	'npm install --production',
	'gulp install'
],{
	verbose: true,
	cwd: 'node_modules/semantic-ui'
}));

//Install bower dependancies
gulp.task('setup.dependant.bower', shell.task([
	'bower install --config.analytics=false --allow-root'
]));

//! Typings Typings
gulp.task('setup.typings', gulp.parallel('setup.typings.server', 'setup.typings.client'));

//Install typings server typings
gulp.task('setup.typings.server', shell.task([
	'typings install'
],{
	cwd: 'server'
}));

//Install typings client typings
gulp.task('setup.typings.client', shell.task([
	'typings install'
],{
	cwd: 'client'
}));

//! Docker Dependancies
gulp.task('setup.docker', gulp.series('setup.docker.mongodb', 'setup.docker.nodejs'));

//Pull required mongodb docker images
gulp.task('setup.docker.mongodb', function(done){
	docker.pull('mongo:latest', function (err, stream) {
		if (err){ throw err; }
		
		//Track progress
		docker.modem.followProgress(stream, function (err, output){
			if (err){ throw err; }
			console.log(output);
			done();
		});
	});
});

//Pull required nodejs docker images
gulp.task('setup.docker.nodejs', function(done){
	docker.pull('node:slim', {Privileged: true}, function (err, stream) {
		if (err){ throw err; }
		
		//Track progress
		docker.modem.followProgress(stream, function (err, output){
			if (err){ throw err; }
			console.log(output);
			done();
		});
	});
});

//! Certificates

//Certificate subject string
let subj = '"/C=' + config.certs.details.country + '/ST=' + config.certs.details.state + '/L=' + config.certs.details.city + '/O=' + config.certs.details.organisation + '/CN=' + config.certs.details.hostname + '"';

//Generate certificates and key files
gulp.task('setup.certs', shell.task([
	'openssl req -new -newkey rsa:2048 -days 1825 -nodes -x509 -subj ' + subj + ' -keyout ' + config.https.ssl.key + ' -out ' + config.https.ssl.cert,
	'openssl req -new -newkey rsa:2048 -days 1825 -nodes -x509 -subj ' + subj + ' -keyout ' + config.database.ssl.key + ' -out ' + config.database.ssl.cert,
	'openssl rand -base64 741 > ' + config.database.repl.key + ' && chmod 600 ' + config.database.repl.key,
	'cat ' + config.database.ssl.key + ' ' + config.database.ssl.cert + ' > ' + config.database.ssl.pem,
	'sudo chown 999:999 ' + config.https.ssl.cert + ' ' + config.database.ssl.cert + ' ' + config.database.repl.key + ' ' + config.database.ssl.pem + ' || true'
],{
	verbose: true,
	cwd: 'certs'
}));

//! Clean

//Clean docker volumes
gulp.task('setup.clean', shell.task([
	'docker images -q | xargs docker rmi || true',
	'docker run -v /let/run/docker.sock:/let/run/docker.sock -v /let/lib/docker:/let/lib/docker --rm martin/docker-cleanup-volumes || true'
],{
	verbose: true,
}));