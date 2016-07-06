//Modules
const gulp = require('gulp');
const path = require('path');
const istanbul = require('istanbul')

//Config
const config = require('../config.js');

/*! Tasks 
- test.merge
*/

//Merge coverage reports
gulp.task('test.merge', function(done){
	let collector = new istanbul.Collector();
	let reporter = new istanbul.Reporter(undefined, 'logs/coverage/merged');
    
    //Add coverage json files
    collector.add(require(path.join(__dirname, '../logs/coverage/client/coverage-final.json')));
    collector.add(require(path.join(__dirname, '../logs/coverage/server/coverage-final.json')));

	//Write merged reports
    reporter.addAll([ 'html', 'text-summary', 'clover', 'json' ]);
    reporter.write(collector, false, function () {
	    done();
    });
});