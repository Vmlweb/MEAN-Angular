//Modules
const gulp = require('gulp')

/*! Tasks 
- server.watch
- server.watch.test
*/

//! Watch
gulp.task('server.watch', function(done){
	gulp.watch([
		'server/**/*.js',
		'server/**/*.ts',
		'server/**/*.json'
	], gulp.series(
		'app.stop',
		'server.build.reload',
		'app.start',
		'app.attach'
	))
	done()
})

//! Watch Tests
gulp.task('server.watch.test', function(done){
	gulp.watch([
		'server/**/*.test.js',
		'server/**/*.test.ts',
		'server/**/*.test.json'
	], gulp.series(
		'server.build.reload',
		'server.test.execute',
		'server.test.report'
	))
	done()
})