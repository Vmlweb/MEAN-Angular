//Modules
var gulp = require("gulp");
var shell = require("gulp-shell");
var tslint = require("gulp-tslint");
var ts = require("gulp-typescript");
var jshint = require("gulp-jshint");

/*! Tasks 
- server.build

- server.build.source
- server.build.typescript
*/

//! Build
gulp.task("server.build", gulp.parallel("server.build.source", "server.build.typescript"));

//Copy over source files
gulp.task("server.build.source", function(){
	return gulp.src([
		"server/**/*",
		"!server/**/*.md",
		"!server/**/*.ts",
		"!server/typings.json",
		"!server/typings",
		"!server/typings/**/*"
	])
	.pipe(gulp.dest("builds/server"));
});

//Compile typescript into javascript
gulp.task("server.build.typescript", function() {
	return gulp.src([
		"server/**/*.ts",
		"!server/**/*.d.ts",
		"server/typings/index.d.ts"
	])
	.pipe(ts(ts.createProject({
		typescript: require("typescript"),
		target: "es5",
		module: "commonjs",
		moduleResolution: "node",
		sourceMap: true,
		emitDecoratorMetadata: true,
		experimentalDecorators: true,
		removeComments: true,
		noImplicitAny: true,
		suppressImplicitAnyIndexErrors: true,
		sortOutput: true
	})))
	.pipe(gulp.dest("builds/server"))
});