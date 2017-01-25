//Modules
const gulp = require('gulp')

/*! Tasks 
- server.watch
- server.watch.test
*/

//! Watch Builds
gulp.task('server.watch', function(done){
	gulp.watch('builds/server/**/*.js', gulp.series(
		'app.stop',
		'server.lint',
		'app.start'
	))
	done()
})

//! Watch Tests
gulp.task('server.watch.test', function(done){
	gulp.watch('builds/server/**/*.js', gulp.series(
		'server.test.execute'
	))
	done()
})