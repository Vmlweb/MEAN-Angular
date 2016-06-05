//Modules
var gulp = require("gulp");
var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var jade = require("gulp-jade");
var stylus = require("gulp-stylus");

//Config
var config = require("../../config.js");

/*! Tasks 
- client.build

- client.build.libs
- client.build.source
- client.build.typescript

- client.build.markup
- client.build.markup.jade
- client.build.markup.stylus
*/

//! Build
gulp.task("client.build", gulp.parallel(
	"client.build.libs",
	"client.build.source",
	"client.build.typescript",
	"client.build.markup"
));

//Copy over library dependancies
gulp.task("client.build.libs", function(){
	return gulp.src(config.libraries)
	.pipe(gulp.dest("builds/client/libs"));
});

//Copy over client source files
gulp.task("client.build.source", function(){
	return gulp.src([
		"client/**/*",
		"!client/**/*.md",
		"!client/**/*.ts",
		"!client/**/*.jade",
		"!client/**/*.styl",
		"!client/typings.json",
		"!client/typings",
		"!client/typings/**/*"
	])
	.pipe(gulp.dest("builds/client"));
});

//Create typescript project
var tsConfig = {
	typescript: require("typescript"),
	target: "es5",
	module: "system",
	moduleResolution: "node",
	sourceMap: true,
	emitDecoratorMetadata: true,
	experimentalDecorators: true,
	removeComments: true,
	noImplicitAny: false,
	suppressImplicitAnyIndexErrors: true,
	sortOutput: true
};
if (process.env.NODE_ENV !== "test"){
	tsConfig.outFile = "app.js";
}
var tsProject = ts.createProject(tsConfig);

//Compile typescript into javascript
gulp.task("client.build.typescript", function() {
	var output = gulp.src("**/*.ts", { cwd: "client" })
		.pipe(sourcemaps.init())
		.pipe(ts(tsProject))
	return output.js
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest("builds/client"));
});

//! Markup
gulp.task("client.build.markup", gulp.parallel("client.build.markup.jade", "client.build.markup.stylus"));

//Compile jade into html
gulp.task("client.build.markup.jade", function(){
	return gulp.src([
		"client/**/*.jade",
		"!client/**/*.inc.jade",
	])
	.pipe(jade())
	.pipe(gulp.dest("builds/client"));
});

//Compile stylus to css
gulp.task("client.build.markup.stylus", function(){
	return gulp.src([
		"client/**/*.styl",
		"!client/**/*.inc.styl"
	])
	.pipe(stylus())
	.pipe(gulp.dest("builds/client"));
});