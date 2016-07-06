//Modules
const gulp = require('gulp');
const ts = require('gulp-typescript');

/*! Tasks 
- server.build

- server.build.source
- server.build.typescript
*/

//! Build
gulp.task('server.build', gulp.parallel('server.build.source', 'server.build.typescript'));

//Copy over source files
gulp.task('server.build.source', function(){
	return gulp.src([
		'server/**/*',
		'!server/**/*.md',
		'!server/**/*.ts',
		'!server/typings.json',
		'!server/typings',
		'!server/typings/**/*'
	])
	.pipe(gulp.dest('builds/server'));
});

//Create typescript project
let tsProject = ts.createProject({
	typescript: require('typescript'),
	target: 'es5',
	module: 'commonjs',
	moduleResolution: 'node',
	sourceMap: true,
	emitDecoratorMetadata: true,
	experimentalDecorators: true,
	removeComments: true,
	noImplicitAny: true,
	suppressImplicitAnyIndexErrors: true,
	sortOutput: true
});

//Compile typescript into javascript
gulp.task('server.build.typescript', function() {
	return gulp.src('**/*.ts', { cwd: 'server' })
	.pipe(ts(tsProject))
	.pipe(gulp.dest('builds/server'))
});