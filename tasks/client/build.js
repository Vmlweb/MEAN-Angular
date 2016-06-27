//Modules
var gulp = require('gulp');
var beep = require('beepbeep');
var path = require('path');
var webpack = require('webpack');
var obfuscatorPlugin = require('webpack-js-obfuscator');
var htmlPlugin = require('html-webpack-plugin');
var typeCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

//Config
var config = require('../../config.js');

/*! Tasks 
- client.build

- client.build.libs
- client.build.source
- client.build.typescript
*/

//! Build
gulp.task('client.build', gulp.parallel(
	'client.build.libs',
	'client.build.source',
	'client.build.webpack'
));

//Copy over library dependancies
gulp.task('client.build.libs', function(){
	return gulp.src(config.libraries)
	.pipe(gulp.dest('builds/client/libs'));
});

//Copy over client source files
gulp.task('client.build.source', function(){
	return gulp.src([
		'client/**/*',
		'!client/**/*.ts',
		'!client/app/**/*',
		'!client/typings.json',
		'!client/typings',
		'!client/typings/**/*'
	])
	.pipe(gulp.dest('builds/client'));
});

//Compile source into a webpack
gulp.task('client.build.webpack', function(done) {
	var options = {
		
		//File types
		resolve: {
			extensions: ['', '.js', '.ts', '.html', '.jade', '.css', '.styl'],
			alias: {
				app: 'client/app',
				common: 'client/common'
			}
		},
		module: {
			noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/, /angular2-polyfills\.js/],
			preLoaders: [
				{ test: /\.js$/, loader: 'source-map-loader', exclude: ['node_modules/rxjs', 'node_modules/@angular'] }
			],
			loaders: [
				{ test: /\.ts$/, loader: 'awesome-typescript-loader', query: {
					tsconfig: 'tsconfig.' + process.env.NODE_ENV + '.json'
				} },
				{ test: /\.html$/, loader: 'html' },
				{ test: /\.css$/, loader: 'css' },
				{ test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' }
			]
		},
		
		//Plugins
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					'ENV': JSON.stringify(process.env.NODE_ENV),
				}
			})
		]
	}
	
	//Shared development and distribution options
	if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'dist'){
	
		//Input and outputs
		options.entry = {
			polyfills: './client/polyfills.ts',
			vendors: './client/vendors.ts',
			app: './client/bootstrap.ts'
		};
		options.output = {
			path: './builds/client',
			filename: '[name].js'
		};
	
		//Generate landing html page
		options.plugins.push(new htmlPlugin({
			template: 'client/index.html'
		}));
		
		//Split into common chunks
		options.plugins.push(new webpack.optimize.CommonsChunkPlugin({
			name: ['app', 'vendors', 'polyfills']
		}));
	}
	
	//Distribution options
	if (process.env.NODE_ENV === 'dist'){	
	
		//Minify
		options.plugins.push(new webpack.optimize.UglifyJsPlugin({
			mangle: false,
			compress: {
				warnings: false
			}
		}));
		
		//Obsfucate
		options.plugins.push(new obfuscatorPlugin({}, [
			'vendors.js',
			'polyfills.js',
			'**.html'
		]));
		
	//Testing options 
	}else if (process.env.NODE_ENV === 'test'){
		
		//Source maps
		options.devtool = 'inline-source-map';
		
		//Modify typescript compilation
		options.ts = {
			compilerOptions: {
				sourceMap: false,
		        sourceRoot: './client',
		        inlineSourceMap: true
			}
		}
		
		//Insert coverage instruments
		options.module.postLoaders = [{
	        test: /\.ts$/,
	        loader: 'istanbul-instrumenter-loader',
	        include: path.resolve('client'),
	        exclude: [/\.test\.ts$/, /node_modules/]
	    }];
	    
	//Development options
	}else if (process.env.NODE_ENV === 'dev'){
		
		//Source maps
		options.devtool = 'eval-source-map';
		
		//Add forked type checker for quicker builds
		options.plugins.push(new typeCheckerPlugin());
		options.plugins.push(new webpack.NoErrorsPlugin());
	}
	
	//Setup callback for completion
	var callback = function(err, stats) {
		
		//Log output of build
		console.log(stats.toString({
			chunkModules: false,
			assets: false
		}));
		
		//Beep for success or errors
		if (process.env.NODE_ENV === 'dev'){
			if (stats.hasErrors()){
				beep(2);
			}else{
				beep();
			}
		}
		
		done();
	};
	
	//Compile and watch for changes if needed
	global.webpack = options;
	var pack = webpack(options);
	if (process.env.NODE_ENV === 'dev'){
		pack.watch({
			aggregateTimeout: 200,
			poll: false
		}, callback);
	}else{
		pack.run(callback);
	}
});