//Modules
const gulp = require('gulp')

/*! Tasks 
- server.watch
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