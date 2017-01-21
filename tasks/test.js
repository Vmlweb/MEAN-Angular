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
	collector.add(require('../logs/tests/client/coverage.json'))
    collector.add(require('../logs/tests/server/coverage.json'))
	
	//Output stats to console
	istanbul.Report.create('text-summary').writeReport(collector, true)
	
	//Write merged json report
	istanbul.Report.create('json', {
		dir: 'logs/tests/merged',
		file: 'coverage.json'
	}).writeReport(collector, true)
	
	//Write merged clover report
	istanbul.Report.create('clover', {
		dir: 'logs/tests/merged',
		file: 'coverage.clover'
	}).writeReport(collector, true)
	
	//Write merged html reports
	istanbul.Report.create('html', {
		dir: 'logs/tests/merged/html',
	}).writeReport(collector, true)
	
	done()
})