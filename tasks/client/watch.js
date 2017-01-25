//Modules
const gulp = require('gulp')

/*! Tasks 
- client.watch
*/

//! Watch
gulp.task('client.watch', function(done){
	gulp.watch('builds/server/**/*.js', gulp.series(
		'client.lint'
	))
	done()
})