//Modules
const gulp = require('gulp')
const path = require('path')
const async = require('async')
const istanbul = require('istanbul')

//Includes
const config = require('../config.js')

/*! Tasks 
- merge

- mock.start
- mock.stop
*/

//Merge coverage reports
gulp.task('merge', function(done){
	
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
		file: 'coverage.xml'
	}).writeReport(collector, true)
	
	//Write merged html reports
	istanbul.Report.create('html', {
		dir: 'logs/tests/merged/html',
	}).writeReport(collector, true)
	
	done()
})

//Create global jasmine jook stores
beforeAllHooks = []
afterAllHooks = []
beforeEachHooks = []
afterEachHooks = []

//Start mock testing server
gulp.task('mock.start', function(done){
	
	//Overide jasmine hooks and collect test functions
	beforeAll = function(func){ beforeAllHooks.push(func) }
	afterAll = function(func){ afterAllHooks.push(func) }
	beforeEach = function(func){ beforeEachHooks.push(func) }
	afterEach = function(func){ afterEachHooks.push(func) }
	describe = function(func){ }
	
	//Start main app
	require(path.resolve('builds/server/main.js'))
	
	//Execute jasmine hooks manually
	async.eachSeries(beforeAllHooks, function(item, callback){
		item(callback)
	}, function(err){
		done()
	})
})

//Stop mock testing server
gulp.task('mock.stop', function(done){
	
	//Execute jasmine hooks manually
	async.eachSeries(afterAllHooks, function(item, callback){
		item(callback)
	}, function(err){
		done()
	})
})