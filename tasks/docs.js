//Modules
var path = require("path");
var moment = require("moment");
var gulp = require("gulp");
var prompt = require("gulp-prompt");
var concat = require("gulp-concat");

/*! Tasks 
- docs.single
- docs.recursive
*/

//Build api documentation from directory
gulp.task("docs.single", function(){
	return gulp.src("package.json").pipe(prompt.prompt({
		type: "input",
		name: "dir",
		message: "Enter the api path to generate documentation"
	}, function(res){
		return gulp.src([
			path.join("server/api", path.join(res.dir, "*.md"))
		])
		.pipe(concat(res.dir.replace(/\//g, '_') + "." + moment().format("YYYY-MM-DD") + ".md"))
		.pipe(gulp.dest("builds/docs"));
	}))
});

//Build api documentation from directory recursively
gulp.task("docs.recursive", function(){
	return gulp.src("package.json").pipe(prompt.prompt({
		type: "input",
		name: "dir",
		message: "Enter the api path to generate documentation"
	}, function(res){
		return gulp.src([
			path.join("server/api", path.join(res.dir, "**/*.md"))
		])
		.pipe(concat(res.dir.replace(/\//g, '_') + "." + moment().format("YYYY-MM-DD") + ".md"))
		.pipe(gulp.dest("builds/docs"));
	}))
});