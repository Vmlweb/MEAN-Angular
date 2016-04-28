//Modules
var gulp = require("gulp");
var tslint = require("gulp-tslint");
var jshint = require("gulp-jshint");

/*! Tasks 
- server.lint

- server.lint.javascript
- server.lint.typescript
*/

//! Lint
gulp.task("server.lint", gulp.parallel("server.lint.javascript", "server.lint.typescript"));

//Check javascript for lint
gulp.task("server.lint.javascript", function(){
	return gulp.src([
		"server/**/*.js",
		"!server/typings/**/*"
	])
	.pipe(jshint({
		esversion: 6
	}))
    .pipe(jshint.reporter("default"));
});

//Check typescript lint
gulp.task("server.lint.typescript", function(){
	return gulp.src([
		"server/**/*.ts",
		"!server/typings/**/*"
	])
	.pipe(tslint({
        configuration: {
	        rules: {
				"no-duplicate-key": true,
				"no-duplicate-variable": true,
				"semicolon": true
	        }
        }
    }))
    .pipe(tslint.report("verbose", {
	    emitError: false
    }));
});