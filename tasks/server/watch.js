//Modules
const gulp = require('gulp')

/*! Tasks 
- server.watch
- server.watch.build
- server.watch.test
*/

//! Watch
gulp.task('server.watch', function(done){
	gulp.watch([ 'server/**/*.js', 'server/**/*.ts' ], gulp.series(
		'wait',
		'server.lint'
	))
	done()
})

//! Watch Builds
gulp.task('server.watch.build', function(done){
	gulp.watch('builds/server/**/*.js', gulp.series(
		'app.stop',
		'app.start',
		'app.attach'
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