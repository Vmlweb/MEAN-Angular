//Modules
const gulp = require('gulp')
const tslint = require('gulp-tslint')

/*! Tasks 
- server.lint
*/

//! Lint
gulp.task('server.lint', function(){
	return gulp.src([ 'server/**/*.js', 'server/**/*.ts' ])
		.pipe(tslint({
			formatter: 'verbose',
			configuration: './tslint.json'
		}))
	    .pipe(tslint.report({
		    emitError: false
	    }))
})