//Modules
const gulp = require('gulp')
const jshint = require('gulp-jshint')

/*! Tasks 
- client.lint
*/

//! Lint
gulp.task('client.lint', function(){
	return gulp.src([
		'client/**/*.js',
		'client/**/*.json'
	])
	.pipe(jshint({
		esversion: 6,
		asi: true
	}))
    .pipe(jshint.reporter())
})