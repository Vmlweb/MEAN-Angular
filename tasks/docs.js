//Modules
var fs = require("fs");
var del = require("del");
var path = require("path");
var moment = require("moment");
var gulp = require("gulp");
var concat = require("gulp-concat");

//Config
var config = require("../config.js");

/*! Tasks 
- docs.reset
- docs.generate
*/

//Remove all documentation files
gulp.task("docs.reset", function(){
	return del([
		"builds/docs/**/*"
	]);
});

//Build api documentation from config
gulp.task("", function(){
	return gulp.src(config.)
		.pipe
});

//Build api documentation from single directory
/*gulp.task("docs.single", function(){
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
				path.join(folder.path, "/**.md")
			])
			.pipe(concat(folder.basename.replace(/\//g, '_') + "." + moment().format("YYYY-MM-DD") + ".md"))
		}))
		.pipe(gulp.dest("builds/docs"));
	}));
});*/