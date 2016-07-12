//Modules
const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
const async = require('async');
const path = require('path');
const docker = require('dockerode')()
const recursive = require('recursive-readdir');

//Config
const config = require('../config.js');

/*! Tasks 
- database.start
- database.test
- database.mock
- database.stop

- database.reset
- database.reset.clean
- database.reset.config
*/

//! Database Server

//Prepare command
let cmd = ['mongod', '--auth', '--keyFile', path.join('/home/certs/', config.database.repl.key), '--replSet', config.database.repl.name];

//Prepare SSL
if (config.database.ssl.enabled){
	cmd.push('--sslMode');
	cmd.push('requireSSL');
	cmd.push('--sslPEMKeyFile');
	cmd.push(path.join('/home/certs/', config.database.ssl.pem));
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
		}
	}, function(err, container) {
		if (err){ throw err; }
		
		//Start container
		container.start({
			Privileged: true,
			Binds: [
				path.join(process.cwd(), 'data') + ':/data/db',
				path.join(process.cwd(), 'certs') + ':/home/certs'
			],
			PortBindings: {
				['27017/tcp']: [{ HostPort: config.database.repl.nodes[0].port.toString()}]
			}
		}, function(err, data){
			if (err){ throw err; }
			setTimeout(done, 500);
		});
	});
});

//Start testing database server (flushes data when finished)
gulp.task('database.test', function(done){
	
	//Prepare container
	docker.createContainer({
		Hostname: config.database.repl.nodes[0].hostname,
		Image: 'mongo',
		Cmd: cmd,
		name: config.name + '_db',
		Volumes: {
			'/home/certs': {}
		}
	}, function(err, container) {
		if (err){ throw err; }
		
		//Start container
		container.start({
			Privileged: true,
			Binds: [
				path.join(process.cwd(), 'certs') + ':/home/certs'
			],
			PortBindings: {
				['27017/tcp']: [{ HostPort: config.database.repl.nodes[0].port.toString()}]
			}
		}, function(err, data){
			if (err){ throw err; }
			setTimeout(done, 500);
		});
	});
});

//Start mock database with reset endpoint (flushes data when finished)
gulp.task('database.mock', function(done){
	
	//Search for test files
	recursive(path.join(__dirname, '../builds/server/tests'), ['!*.test.js', 'setup.test.js'], function (err, files) {
		
		//Define testing capture functions
		let beforeAlls = [];
		let beforeEachs = [];
		let afterAlls = [];
		beforeAll = function(func){
			beforeAlls.push(func);
		};
		beforeEach = function(func){
			beforeEachs.push(func);
		};
		afterAll = function(func){
			afterAlls.push(func);
		};
		
		//Start main app
		require(path.join(__dirname, '../builds/server/tests/setup.test.js'));
		for (i in files){ require(files[i]); }
		
		//Run before all functions
		async.each(beforeAlls, function (item, back){ item(back); }, function(){
			
			//Define reset database api endpoint route
			global.app.express.app.delete('/reset', function (req, res){
				async.each(beforeEachs, function (item, back){ item(back); }, function (){
					res.json({});
				});
			});
			
			log.info('Database testing reset endpoint loaded');
			
			//Run after all functions
			global.shutdown = function(callback){
				async.each(afterAlls, function (item, back){ item(back); }, function (){
					callback();
				});
			};
			
			setTimeout(done, 500);
		});
	});
});

//Stop database server
gulp.task('database.stop', function(done){
	let container = docker.getContainer(config.name + '_db');
	container.stop({ t: 5 }, function(err, data){
		container.remove({ force: true }, function(err, data){
			done();
		});
	});
});

//! Reset Data
gulp.task('database.reset', gulp.series(
	gulp.parallel('database.stop', 'build.config.mongodb'),
	gulp.series('database.reset.clean', 'database.start', 'database.reset.config', 'database.stop')
));

//Remove all database files
gulp.task('database.reset.clean', function(done){
	return del([
		'data/**/*'
	]);
});

//Reconfigure database with mongodb.js
gulp.task('database.reset.config', function(done){
	let container = docker.getContainer(config.name + '_db');
	
	//Prepare command
	let cmd = ['mongo'];
	
	//Prepare SSL
	if (config.database.ssl.enabled){
		cmd.push('--ssl');
		cmd.push('--sslAllowInvalidCertificates');
	}
	
	//Prepare command
	container.exec({
		Cmd: cmd,
		AttachStdin: true,
		AttachStdout: true,
		Tty: false
	}, function(err, exec) {
		if (err){ throw err; }
		
		//Execute command
		exec.start({
			hijack: true,
			stdin: true,
			stdout: true
		}, function(err, stream) {
			if (err){ throw err; }
						
			//Stream output to console
	        container.modem.demuxStream(stream, process.stdout, process.stderr);
		
			//Stream file into container mongo cli
			fs.createReadStream('builds/mongodb.js', 'binary').pipe(stream).on('end', function(){
				done();
			});
		});
	});
});