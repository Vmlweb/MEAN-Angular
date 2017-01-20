//Modules
const gulp = require('gulp')

/*! Tasks 
- client.watch
- client.watch.test
*/

//! Watch
gulp.task('client.watch', function(done){
	done()
})

//! Watch Tests
gulp.task('client.watch.test', function(done){
	gulp.watch([
		'client/**/*.test.js',
		'client/**/*.test.ts',
		'client/**/*.test.json'
	], gulp.series(
		'client.build.reload',
		'client.test.execute',
		'client.test.report'
	))
	done()
})