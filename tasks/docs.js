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
gulp.task("docs.generate", function(){
	var includes = [];
	var name = "";
	
	//Check if using a test plan
	if (process.env.hasOwnProperty("docs") && process.env.docs.length > 0){
		name = process.env.docs;
		for (i in config.docs[process.env.docs]){
			includes.push(path.join("server", config.docs[process.env.docs][i]));
		}
	}else{
		name = "api";
		includes = [
			"server/api/**/*.md"
		];
	}
	
	//Generate concat documentation
	return gulp.src(includes)
		.pipe(concat(name + "." + moment().format("YYYY-MM-DD") + ".md"))
		.pipe(gulp.dest("builds/docs"));
});