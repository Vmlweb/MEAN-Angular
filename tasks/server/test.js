//Modules
var gulp = require("gulp");
var jasmine = require("gulp-jasmine");
var sreporter = require("jasmine-spec-reporter");
var jreporter = require("jasmine-reporters");

/*! Tasks 
- server.test

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
	"server.test.jasmine",
	"stop"
));

//Test server with jasmine
gulp.task("server.test.jasmine", function(){
	return gulp.src([
		"builds/server/tests/setup.test.js",
		"builds/server/tests/*.test.js",
		"builds/server/**/*.test.js"
	])
	.pipe(jasmine({
		reporter: [
			new sreporter({
				displayStacktrace: "all"
			}),
			new jreporter.JUnitXmlReporter({
				savePath: "logs/tests",
				consolidateAll: false
			})
		]
	}));
});