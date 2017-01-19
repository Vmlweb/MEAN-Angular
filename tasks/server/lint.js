//Modules
const gulp = require('gulp')
const jshint = require('gulp-jshint')

/*! Tasks 
- server.lint
*/

//! Lint
gulp.task('server.lint', function(){
	return gulp.src([
		'server/**/*.js',
		'server/**/*.json'
	])
	.pipe(jshint({
		esversion: 6,
		asi: true
	}))
    .pipe(jshint.reporter())
})