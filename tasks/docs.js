//Modules
var fs = require("fs");
var del = require("del");
var path = require("path");
var moment = require("moment");
var gulp = require("gulp");
var prompt = require("gulp-prompt");
var concat = require("gulp-concat");
var foreach = require("gulp-foreach");

/*! Tasks 
- docs.reset
- docs.single
- docs.recursive
*/

//Remove all documentation files
gulp.task("docs.reset", function(){
	return del([
		"builds/docs/**/*"
	]);
});

//Build api documentation from single directory
gulp.task("docs.single", function(){
	return gulp.src("package.json").pipe(prompt.prompt({
		type: "input",
		name: "dir",
		message: "Enter the api path to generate documentation"
	}, function(res){
		
		//Generate docs for directory
		return gulp.src([
			path.join("server/api", res.dir, "/*.md")
		])
		.pipe(concat(res.dir.replace(/\//g, '_') + "." + moment().format("YYYY-MM-DD") + ".md"))
		.pipe(gulp.dest("builds/docs"));
	}));
});

//Build api documentation from directory recursively
gulp.task("docs.recursive", function(){
	return gulp.src("package.json").pipe(prompt.prompt({
		type: "input",
		name: "dir",
		message: "Enter the api path to generate documentation"
	}, function(res){
		
		//Scan directory recursively
		return gulp.src([
			path.join("server/api", path.join(res.dir, "*"))
		])
		.pipe(foreach(function(stream, folder){
			
			//Generate docs for directory
			return gulp.src([
				path.join(folder.path, "/**/*.md")
			])
			.pipe(concat(folder.basename.replace(/\//g, '_') + "." + moment().format("YYYY-MM-DD") + ".md"))
		}))
		.pipe(gulp.dest("builds/docs"));
	}));
});