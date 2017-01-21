//Modules
const gulp = require('gulp')

/*! Tasks 
- client.watch
- client.watch.test
*/

//! Watch
gulp.task('client.watch', function(done){
	gulp.watch([
		'client/**/*.js',
		'client/**/*.ts',
		'client/**/*.json'
	], gulp.series(
		'client.lint'
	))
	done()
})

//! Watch Tests
gulp.task('client.watch.test', function(done){
	gulp.watch([
		'client/**/*.js',
		'client/**/*.ts',
		'client/**/*.json'
	], gulp.series(
		'client.build.reload'
	))
	done()
})