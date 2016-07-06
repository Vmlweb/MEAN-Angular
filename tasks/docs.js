//Modules
const del = require('del');
const path = require('path');
const moment = require('moment');
const gulp = require('gulp');
const concat = require('gulp-concat');

//Config
const config = require('../config.js');

/*! Tasks 
- docs.reset
*/

//Remove all documentation files
gulp.task('docs.reset', function(){
	return del([
		'builds/docs/**/*'
	]);
});

//Build api documentation from config
config.docs.api = [ '/api/**/*.md' ];
for (let i in config.docs){
	(function(i) {
		
		//Define individual task for each doc
		gulp.task(i + '.docs', function(){
			
			//Gather files to include
			let includes = [];
			for (d in config.docs[i]){
				includes.push(path.join('server', config.docs[i][d]));
			}
			
			//Generate concat documentation
			return gulp.src(includes)
				.pipe(concat(i + '.' + moment().format('YYYY-MM-DD') + '.md'))
				.pipe(gulp.dest('builds/docs'));
		});

	})(i);
}