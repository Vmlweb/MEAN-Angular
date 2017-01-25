//Modules
const gulp = require('gulp')

/*! Tasks 
- client.watch
*/

//! Watch
gulp.task('client.watch', function(done){
	gulp.watch([ 'server/**/*.js', 'server/**/*.ts' ], gulp.series(
		'client.lint'
	))
	done()
})