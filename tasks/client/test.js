//Modules
var gulp = require("gulp");
var Karma = require("karma").Server;

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
	gulp.parallel("client.build", "build.config"),
	"client.test.karma"
));

//Test client with karma
gulp.task("client.test.karma", function(done){
	
	//Generate include files
	var includes = [];
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
		plugins: ["karma-phantomjs2-launcher", "karma-jasmine", "karma-mocha-reporter", "karma-junit-reporter"],
		browsers: ["PhantomJS2"],
		colors: true,
		autoWatch: false,
		singleRun: true,
		files: includes.concat([
			{ pattern: "karma.shim.js", included: true },
			{ pattern: "builds/client/**/*.js", included: false },
			{ pattern: "builds/client/**/*.js.map", included: false }
		]),
		reporters: ["mocha", "junit"],
		junitReporter: {
			outputDir: 'logs/tests'
		}
	}, function(){
		done();
	}).start();
});