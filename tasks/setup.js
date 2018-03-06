//Modules
const gulp = require('gulp')
const shell = require('gulp-shell')
const concat = require('gulp-concat')
const chown = require('gulp-chown')
const chmod = require('gulp-chmod')
const path = require('path')
const signature = require('selfsigned')
const fs = require('fs')
const crypto = require('crypto')

//Includes
const config = require('../config.js')
const docker = require('dockerode')(config.docker)

/*! Tasks
- dirs

- certs
- certs.https
- certs.mongo
- certs.merge
- certs.permissions

- install
- install.nodejs
- install.mongodb
*/

//! Dirs
gulp.task('dirs', function(done){
	try{ fs.mkdirSync(path.resolve('./certs')) }catch(err){}
	try{ fs.mkdirSync(path.resolve('./logs')) }catch(err){}
	try{ fs.mkdirSync(path.resolve('./builds')) }catch(err){}
	try{ fs.mkdirSync(path.resolve('./dist')) }catch(err){}
	done()
})

//! Certs
gulp.task('certs', gulp.series(
	'certs.https',
	'certs.mongo',
	'certs.merge',
	'certs.permissions'
))

//Generate https ssl certificate files
gulp.task('certs.https', function(done){

	//Generate certificates and write to file
	const perms = signature.generate()
	fs.writeFileSync(path.resolve('./certs', config.https.ssl.cert), perms.cert)
	fs.writeFileSync(path.resolve('./certs', config.https.ssl.key), perms.private)

	done()
})

//Generate mongo ssl certificate files
gulp.task('certs.mongo', function(done){

	//Generate repl key and write to file
	const key = crypto.randomBytes(741).toString('base64')
	fs.writeFileSync(path.resolve('./certs', config.database.repl.key), key)

	//Generate certificates and write to file
	const perms = signature.generate()
	fs.writeFileSync(path.resolve('./certs', config.database.ssl.cert), perms.cert)
	fs.writeFileSync(path.resolve('./certs', config.database.ssl.key), perms.private)

	done()
})

//Merge database certs toggether for pem
gulp.task('certs.merge', function(){
	return gulp.src([ 'certs/' + config.database.ssl.key, 'certs/' + config.database.ssl.cert ])
		.pipe(concat(config.database.ssl.pem))
		.pipe(gulp.dest('certs'))
})

//Configure file permissions for database cert
gulp.task('certs.permissions', function(){
	return gulp.src('certs/' + config.database.repl.key)
		.pipe(chmod({
			owner: { read: true, write: true, execute: false },
			group: { read: false, write: false, execute: false },
			others: { read: false, write: false, execute: false }
		}))
		.pipe(chown(999, 999))
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
