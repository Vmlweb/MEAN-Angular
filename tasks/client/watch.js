//Modules
const gulp = require('gulp')

/*! Tasks 
- client.watch
*/

//! Watch
gulp.task('client.watch', function(done){
	gulp.watch([ 'client/**/*.js', 'client/**/*.ts' ], gulp.series(
		'client.lint'
	))
	done()
})