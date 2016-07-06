//Modules
const gulp = require('gulp');
const tslint = require('gulp-tslint');
const jshint = require('gulp-jshint');

/*! Tasks 
- client.lint

- client.lint.javascript
- client.lint.typescript
*/

//! Lint
gulp.task('client.lint', gulp.parallel('client.lint.javascript', 'client.lint.typescript'));

//Check javascript for lint
gulp.task('client.lint.javascript', function(){
	return gulp.src([
		'client/**/*.js',
		'!client/**/*.min.js',
		'!client/typings/**/*'
	])
	.pipe(jshint({
		esversion: 6
	}))
    .pipe(jshint.reporter('default'));
});

//Check typescript lint
gulp.task('client.lint.typescript', function(){
	return gulp.src([
		'client/**/*.ts',
		'!client/typings/**/*'
	])
	.pipe(tslint({
        configuration: {
	        rules: {
				'no-duplicate-key': true,
				'no-duplicate-letiable': true,
				'semicolon': true
	        }
        }
    }))
    .pipe(tslint.report('verbose', {
	    emitError: false
    }));
});