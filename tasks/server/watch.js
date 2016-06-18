//Modules
var gulp = require('gulp');

/*! Tasks 
- server.watch

- server.watch.source
- server.watch.typescript
*/

//! Development
gulp.task('server.watch', gulp.parallel('server.watch.source', 'server.watch.typescript'));

//Watch for source file changes
gulp.task('server.watch.source', function(done){
	gulp.watch([
		'server/**/*',
		'!server/**/*.ts',
		'!server/**/*.d.ts'
	], gulp.series('app.stop', 'server.build.source', 'app.start', 'app.attach', 'beep'));
	done();
});

//Watch for typescript file changes
gulp.task('server.watch.typescript', function(done){
	gulp.watch([
		'server/**/*.ts',
		'!server/**/*.d.ts'
	], gulp.series('app.stop', 'server.build.typescript', 'app.start', 'app.attach', 'beep'));
	done();
});