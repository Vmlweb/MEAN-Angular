//Modules
var gulp = require("gulp");
var jasmine = require("gulp-jasmine");
var reporter = require("jasmine-spec-reporter");

/* !Tasks 
- server.test
- server.test.jasmine
*/

// !Test
gulp.task("server.test", gulp.series(
	gulp.parallel("stop"),
	gulp.parallel("server.build", "build.config"),
	gulp.parallel("database.test"),
	gulp.parallel("database.reset.config"),
	gulp.parallel("server.test.jasmine"),
	gulp.parallel("stop")
));

//Test server with jasmine
gulp.task("server.test.jasmine", function(){
	return gulp.src("builds/server/**/*.test.js")
		.pipe(jasmine({
			reporter: new reporter({
				displayStacktrace: "all"
			})
		}));
});