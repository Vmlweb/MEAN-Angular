//Modules
const gulp = require('gulp')
const path = require('path')
const fs = require('fs')
const async = require('async')
const decache = require('decache')
const istanbul = require('istanbul')
const mongoose = require('mongoose')

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
	if (fs.existsSync('./logs/tests/client/unit/coverage.json')){ collector.add(require('../logs/tests/client/unit/coverage.json')) }
    if (fs.existsSync('./logs/tests/server/unit/coverage.json')){ collector.add(require('../logs/tests/server/unit/coverage.json')) }
    if (fs.existsSync('./logs/tests/server/feature/coverage.json')){ collector.add(require('../logs/tests/server/feature/coverage.json')) }
	
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
	
	//Clear node require cache
	decache(path.resolve('builds/server/main.js'))
	
	//Reset mongoose model cache
	mongoose.models = []
	mongoose.modelSchemas = []
	
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