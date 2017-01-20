//Modules
const gulp = require('gulp')
const tslint = require('gulp-tslint')

/*! Tasks 
- server.lint
*/

//! Lint
gulp.task('server.lint', function(){
	return gulp.src('server/**/*.ts')
		.pipe(tslint({
			formatter: 'verbose',
			configuration: {
				rules: {
					indent: [ true, 'tabs' ],
					quotemark: [ true, 'single' ],
					"trailing-comma": [ true, { "multiline": "always", "singleline": "always" } ],
					semicolon: false,
					'no-default-export': true,
					'object-literal-sort-keys': true,
					'no-trailing-whitespace': true,
					'prefer-const': true
				}
			}
		}))
	    .pipe(tslint.report({
		    emitError: false
	    }))
})