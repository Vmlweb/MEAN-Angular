//Modules
var gulp = require("gulp");
var shell = require("gulp-shell");
var replace = require("gulp-replace");
var tslint = require("gulp-tslint");
var ts = require("gulp-typescript");
var jshint = require("gulp-jshint");

/* !Tasks 
- server.build
	
- server.build.copy
- server.build.copy.source

- server.build.javascript
- server.build.javascript.lint

- server.build.typescript
- server.build.typescript.lint
- server.build.typescript.compile
*/

// !Build
gulp.task("server.build", gulp.series(
	gulp.parallel("server.build.javascript", "server.build.typescript"),
	gulp.parallel("server.build.copy")
));

// !Copy
gulp.task("server.build.copy", gulp.parallel("server.build.copy.source"));

//Copy over server source files
gulp.task("server.build.copy.source", function(){
	return gulp.src([
		"server/**/*",
		"!server/**/*.md",
		"!server/**/*.ts",
		"!server/tsd.json",
		"!server/typings",
		"!server/typings/**/*"
	])
	.pipe(gulp.dest("builds/server"));
});

// !Javascript
gulp.task("server.build.javascript", gulp.series("server.build.javascript.lint"));

//Check javascript for lint
gulp.task("server.build.javascript.lint", function(){
	return gulp.src([
		"server/**/*.js",
		"!server/typings/**/*",
	])
	.pipe(jshint())
    .pipe(jshint.reporter("default"));
});

// !Typescript
gulp.task("server.build.typescript", gulp.series("server.build.typescript.lint", "server.build.typescript.compile"));

//Check typescript for lint
gulp.task("server.build.typescript.lint", function(){
	return gulp.src([
		"server/**/*.ts",
		"!server/typings/**/*",
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

//Compile typescript into javascript
gulp.task("server.build.typescript.compile", function() {
	return gulp.src([
		"server/**/*.ts",
		"server/typings/**/*.d.ts"
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