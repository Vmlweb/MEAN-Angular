//Modules
const gulp = require('gulp')
const path = require('path')
const istanbul = require('istanbul')

//Includes
const config = require('../config.js')

/*! Tasks 
- test.merge
*/

//Merge coverage reports
gulp.task('test.merge', function(done){
	
    //Collect coverage json files
    const collector = new istanbul.Collector()
	collector.add(require(path.join(__dirname, '../logs/tests/client/coverage.json')))
    collector.add(require(path.join(__dirname, '../logs/tests/server/coverage.json')))

	//Write merged reports
    const reporters = new istanbul.Reporter(undefined, 'logs/tests/merged')
    reporters.addAll([ 'text-summary', 'clover', 'json' ])
    reporters.write(collector, false, function(){
	    
		//Write merged html reports
		const html = new istanbul.Reporter(undefined, 'logs/tests/merged/html')
		html.add( 'html' )
		html.write(collector, false, done)
	})
})