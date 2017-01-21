//Modules
const gulp = require('gulp')
const tslint = require('gulp-tslint')

/*! Tasks 
- client.lint
*/

//! Lint
gulp.task('client.lint', function(){
	return gulp.src('client/**/*.ts')
		.pipe(tslint({
			formatter: 'verbose',
			configuration: './tslint.json'
		}))
	    .pipe(tslint.report({
		    emitError: false
	    }))
})