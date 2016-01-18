//Modules
var gulp = require("gulp");
var shell = require("gulp-shell");
var del = require("del");
var fs = require("fs");
var path = require("path");
var uglify = require("gulp-uglify");
var obfuscator = require('gulp-js-obfuscator');
var cssnano = require("gulp-cssnano");
var sourcemaps = require("gulp-sourcemaps");
var config = require("../config.js");
var dockerode = require("dockerode");
var docker = dockerode();

/*! Tasks 
- dist.reset
- dist.build
	
- dist.copy
- dist.copy.certs
- dist.copy.config
- dist.copy.server
- dist.copy.client

- dist.minify
- dist.minify.css
- dist.minify.server
- dist.minify.client
*/

//Remove all dist files
gulp.task("dist.reset", function(){
	return del([
		"dist/**/*"
	]);
});

//Build the docker images and app
gulp.task("dist.build", shell.task([
	"docker build -t " + config.name + "_app $PWD",
	"docker save " + config.name + "_app > " + config.name + "_app.tar",
	"chmod +x server.sh"
],{
	verbose: true,
	cwd: "dist"
}));

//! Copy
gulp.task("dist.copy", gulp.parallel("dist.copy.config", "dist.copy.server", "dist.copy.client"));

//Copy over config files
gulp.task("dist.copy.config", function(){
	return gulp.src([
		"builds/package.json",
		"builds/Dockerfile",
		"builds/docker-compose.yml",
		"builds/mongodb.js",
		"builds/server.sh"
	])
	.pipe(gulp.dest("dist"));
});

//Copy over server source files
gulp.task("dist.copy.server", function(){
	return gulp.src([
		"builds/server/**/*",
		"!builds/server/tests/*",
		"!builds/server/**/*.js.map",
		"!builds/server/**/*.test.js",
	])
	.pipe(gulp.dest("dist/server"));
});

//Copy over client source files
gulp.task("dist.copy.client", function(){
	return gulp.src([
		"builds/client/**/*",
		"!builds/client/tests/*",
		"!builds/client/**/*.js.map",
		"!builds/client/**/*.test.js",
	])
	.pipe(gulp.dest("dist/client"));
});

//! Minify
gulp.task("dist.minify", gulp.series(
	gulp.parallel("dist.minify.server", "dist.minify.css"),
	gulp.parallel("dist.minify.client")
));

//Minify server and client css files
gulp.task("dist.minify.css", function(){
	return gulp.src([
		"dist/client/**/*.css",
		"!dist/client/libs/**/*"
	])
	.pipe(cssnano())
	.pipe(gulp.dest("dist/client"));
});

//Minify server javascript files
gulp.task("dist.minify.server", function(){
	return gulp.src([
		"dist/server/**/*.js",
		"!dist/server/libs/**/*"
	])
	.pipe(uglify())
	.pipe(obfuscator())
	.pipe(gulp.dest("dist/server"));
});

//Minify client javascript files
gulp.task("dist.minify.client", function(){
	return gulp.src([
		"dist/client/**/*.js",
		"!dist/client/libs/**/*"
	])
	.pipe(uglify())
	.pipe(obfuscator())
	.pipe(gulp.dest("dist/client"));
});