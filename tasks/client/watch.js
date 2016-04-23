//Modules
var gulp = require("gulp");

/*! Tasks 
- client.watch
- client.watch.source
- client.watch.typescript
- client.watch.jade
- client.watch.stylus
*/

//! Development
gulp.task("client.watch", gulp.parallel("client.watch.source", "client.watch.typescript", "client.watch.jade", "client.watch.stylus"));

//Watch for source files changes
gulp.task("client.watch.source", (done) => {
	gulp.watch([
		"client/**/*",
		"!client/**/*.jade",
		"!client/**/*.styl",
		"!client/**/*.ts",
		"!client/**/*.d.ts"
	], gulp.series("client.build.copy.source"));
	done();
});

//Watch for typescript file changes
gulp.task("client.watch.typescript", (done) => {
	gulp.watch([
		"client/**/*.ts",
		"!client/**/*.d.ts"
	], gulp.series("client.build.typescript"));
	done();
});

//Watch for jade file changes
gulp.task("client.watch.jade", (done) => {
	gulp.watch([
		"client/**/*.jade"
	], gulp.series("client.build.markup.jade"));
	done();
});

//Watch for stylus file changes
gulp.task("client.watch.stylus", (done) => {
	gulp.watch([
		"client/**/*.styl"
	], gulp.series("client.build.markup.stylus"));
	done();
});