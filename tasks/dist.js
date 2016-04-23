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
- dist.minify.libs

- dist.obfuscate
- dist.obfuscate.server
- dist.obfuscate.client
*/

//Remove all dist files
gulp.task("dist.reset", () => {
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
gulp.task("dist.copy.config", () => {
	return gulp.src([
		"builds/config.js",
		"builds/package.json",
		"builds/Dockerfile",
		"builds/docker-compose.yml",
		"builds/mongodb.js",
		"builds/server.sh"
	])
	.pipe(gulp.dest("dist"));
});

//Copy over server source files
gulp.task("dist.copy.server", () => {
	return gulp.src([
		"builds/server/**/*",
		"!builds/server/tests/*",
		"!builds/server/**/*.js.map",
		"!builds/server/**/*.min.map",
		"!builds/server/**/*.test.js",
		"!builds/server/**/*.test.json"
	])
	.pipe(gulp.dest("dist/server"));
});

//Copy over client source files
gulp.task("dist.copy.client", () => {
	return gulp.src([
		"builds/client/**/*",
		"!builds/client/tests/*",
		"!builds/client/**/*.js.map",
		"!builds/client/**/*.min.map",
		"!builds/client/**/*.test.js",
		"!builds/client/**/*.test.json"
	])
	.pipe(gulp.dest("dist/client"));
});

//! Minify
gulp.task("dist.minify", gulp.parallel(
	"dist.minify.css",
	"dist.minify.server",
	"dist.minify.client",
	"dist.minify.libs"
));

//Minify server and client css files
gulp.task("dist.minify.css", () => {
	return gulp.src([
		"dist/client/**/*.css"
	])
	.pipe(cssnano())
	.pipe(gulp.dest("dist/client"));
});

//Minify server javascript files
gulp.task("dist.minify.server", () => {
	return gulp.src([
		"dist/server/**/*.js"
	])
	.pipe(uglify())
	.pipe(gulp.dest("dist/server"));
});

//Minify client javascript files
gulp.task("dist.minify.client", () => {
	return gulp.src([
		"dist/client/**/*.js",
		"!dist/client/libs/**/*.js"
	])
	.pipe(uglify())
	.pipe(gulp.dest("dist/client"));
});

//Minify client javascript library files
gulp.task("dist.minify.libs", () => {
	return gulp.src([
		"dist/client/libs/**/*.js"
	])
	.pipe(uglify({
		mangle: false,
		preserveComments: (node, comment) => {
			return !(comment.value.indexOf("sourceMapping") != -1);
		}
	}))
	.pipe(gulp.dest("dist/client/libs"));
});

//! Obfuscate
gulp.task("dist.obfuscate", gulp.series(
	"dist.obfuscate.server",
	"dist.obfuscate.client"
));

//Obfuscate server javascript files
gulp.task("dist.obfuscate.server", () => {
	return gulp.src([
		"dist/server/**/*.js",
		"!dist/server/libs/**/*.js"
	])
	.pipe(obfuscator())
	.pipe(gulp.dest("dist/server"));
});

//Obfuscate client javascript files
gulp.task("dist.obfuscate.client", () => {
	return gulp.src([
		"dist/client/**/*.js",
		"!dist/client/libs/**/*.js"
	])
	.pipe(obfuscator())
	.pipe(gulp.dest("dist/client"));
});