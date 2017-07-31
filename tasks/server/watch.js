//Modules
const gulp = require('gulp')

/*! Tasks 
- server.watch
- server.watch.test
*/

//! Watch
gulp.task('server.watch', function(done){
	gulp.watch([ 'server/**/*.js', 'server/**/*.ts' ], gulp.series(
		'server.lint'
	))
	done()
})

//! Watch Builds
gulp.task('server.watch.build', function(done){
	gulp.watch('builds/server/**/*.js', gulp.series(
		'app.stop',
		'app.start'
	))
	done()
})

//! Watch Unit Tests
gulp.task('server.watch.test.unit', function(done){
	gulp.watch('builds/server/**/*.js', gulp.series(
		'server.test.unit.execute'
	))
	done()
})

//! Watch Feature Tests
gulp.task('server.watch.test.feature', function(done){
	gulp.watch('builds/server/**/*.js', gulp.series(
		'server.test.feature.execute'
	))
	gulp.watch('server/**/*.feature', gulp.series(
		'server.test.feature.execute'
	))
	done()
})