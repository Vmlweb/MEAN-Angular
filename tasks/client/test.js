//Modules
var gulp = require("gulp");
var path = require("path");
var Karma = require("karma").Server;
var remap = require('remap-istanbul');

//Config
var config = require("../../config.js");

/*! Tasks 
- client.test

- client.test.karma
*/

//! Test
gulp.task("client.test", gulp.series(
	"env.test",
	"stop",
	"clean",
	"build",
	"database.test",
	"database.reset.config",
	"database.mock",
	"client.test.karma"
));

//Test client with karma
gulp.task("client.test.karma", function(done){
	var includes = [];
	
	//Generate include files
	for (var i in config.libraries){
		includes.push({
			pattern: config.libraries[i],
			included: config.libraries[i].endsWith("js")
		});
	}
	
	//Setup configuration
	var server = new Karma({
		basePath: "",
		frameworks: ["jasmine"],
		plugins: [
			"karma-coverage",
			"karma-phantomjs-launcher",
			"karma-jasmine",
			"karma-mocha-reporter",
			"karma-junit-reporter"
		],
		browsers: ["PhantomJS"],
		colors: true,
		autoWatch: false,
		singleRun: true,
		files: includes.concat([
			{ pattern: "karma.shim.js", included: true },
			{ pattern: "builds/client/**/*.js", included: false },
			{ pattern: "builds/client/**/*.js.map", included: false }
		]),
		reporters: ["mocha", "junit", "coverage"],
		preprocessors: {
			"builds/client/**/!(*.test).js": ["coverage"]
		},
		coverageReporter: {
			reporters: [
				{type: "json", dir:"logs/coverage/client", file: "coverage-final.json", subdir: "."},
				{type: "text-summary"}
			]
		},
		junitReporter: {
			outputDir: "logs/tests/client"
		}
	}, function(){
		
		//Lookup typescript generated code from source map
		remap('logs/coverage/client/coverage-final.json', {
			html: "logs/coverage/client",
			clover: "logs/coverage/client/clover.xml"
		});
		
		global.shutdown(done);
	}).start();
});