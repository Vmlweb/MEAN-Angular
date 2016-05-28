//Modules
var gulp = require("gulp");
var path = require("path");
var jasmine = require("gulp-jasmine");
var sreporter = require("jasmine-spec-reporter");
var jreporter = require("jasmine-reporters");
var istanbul = require('gulp-istanbul');

//Config
var config = require("../../config.js");

/*! Tasks 
- server.test

- server.test.coverage
- server.test.jasmine
*/

//! Test
gulp.task("server.test", gulp.series(
	"env.test",
	"stop",
	"clean",
	gulp.parallel("server.build", "build.config"),
	"database.test",
	"database.reset.config",
	"server.test.coverage",
	"server.test.jasmine",
	"stop"
));

//Insert coverage hooks
gulp.task("server.test.coverage", function(){
	return gulp.src([
		"builds/server/api/**/*.js",
		"!builds/server/api/**/*.test.js"
	])
	.pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

//Test server with jasmine
gulp.task("server.test.jasmine", function(){
	var includes = [];
	
	//Check if using a test plan
	if (process.env.hasOwnProperty("test") && process.env.test.length > 0){
		for (i in config.tests[process.env.test]){
			var tests = config.tests[process.env.test][i];
			includes.push(path.join("builds/server", tests));
		}
	}else{
		includes = includes.concat([
			"builds/server/tests/*.test.js",
			"builds/server/**/*.test.js"
		]);
	}
	
	return gulp.src([
		"builds/server/tests/setup.test.js"
	].concat(includes))
	.pipe(jasmine({
		reporter: [
			new sreporter({
				displayStacktrace: "all"
			}),
			new jreporter.JUnitXmlReporter({
				savePath: "logs/tests/server",
				consolidateAll: false
			})
		]
	}))
	.pipe(istanbul.writeReports({
		dir: "logs/coverage/server",
		reporters: ["html", "text-summary", "clover", "json"]
	}));
});