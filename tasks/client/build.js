//Modules
const gulp = require('gulp')
const path = require('path')
const beep = require('beepbeep')
const fs = require('fs')
const webpack = require('webpack')
const WebpackObfuscator = require('webpack-obfuscator')
const WebpackHTML = require('html-webpack-plugin')
const WebpackFavicons = require('favicons-webpack-plugin')
const PathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin
const { CheckerPlugin } = require('awesome-typescript-loader')

//Config
const config = require('../../config.js')
module.exports = { setup: false, webpack: undefined }

/*! Tasks
- client.build

- client.build.libs
- client.build.compile
*/

//! Build
gulp.task('client.build', gulp.series(
	'client.build.libs',
	'client.build.compile'
))

//Copy client library files
gulp.task('client.build.libs', function(){
	return gulp.src(config.libs)
		.pipe(gulp.dest('builds/client/libs'))
})

//Setup webpack for compilation
gulp.task('client.build.compile', function(done){
	
	//Create options
	module.exports.webpack = {
		entry: process.env.NODE_ENV === 'testing' ? {
			main: './client/test.ts'
		} : {
			polyfills: './client/polyfills.ts',
			vendor: './client/vendor.ts',
			libs: './client/libs.ts',
			main: './client/main.ts'
		},
		target: 'web',
		plugins: [
		    new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/, './client'),
			new webpack.DefinePlugin({
				'process.env.ENV': JSON.stringify(process.env.NODE_ENV),
				'process.env.TEST': JSON.stringify(process.env.TEST),
				'process.env.MODE': JSON.stringify(process.env.MODE),
				'process.env.URL': JSON.stringify('http://' + config.http.url + ':' + config.http.port.internal)
			}),
			new CheckerPlugin({
				fork: true,
				useWebpackText: true
			}),
			new WebpackHTML({
				title: config.name,
				template: './client/index.ejs',
				minify: {
					removeComments: true,
					collapseWhitespace: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeStyleLinkTypeAttributes: true,
					keepClosingSlash: true,
					minifyJS: true,
					minifyCSS: true,
					minifyURLs: true
				},
				js: config.libs.filter(function(lib){
						return lib.endsWith('.js')
					}).map(function(lib){
						return '/libs/' + path.basename(lib)
					}),
				css: config.libs.filter(function(lib){
						return lib.endsWith('.css')
					}).map(function(lib){
						return '/libs/' + path.basename(lib)
					})
			})
		],
		performance: {
			hints: false
		},
		output: {
			path: './builds/client',
			filename: '[name].js'
		},
		resolve: {
			modules: [ './client', './bower_components', './node_modules' ],
			extensions: [ '.js', '.ts', '.json', '.png', '.jpg', '.jpeg', '.gif' ],
			alias: {
				config: '../config.js',
				jquery: process.env.NODE_ENV === 'production' ? 'jquery/dist/jquery.min' : 'jquery/src/jquery',
				semantic: process.env.NODE_ENV === 'production' ? '../semantic/dist/semantic.min' : '../semantic/dist/semantic'
			},
			plugins: [
				new PathsPlugin()
			]
		},
		module: {
			rules: [{
				test: /\.(png|jpg|jpeg|gif)$/,
				loader: 'file-loader?name=images/[hash].[ext]&publicPath=&outputPath='
			},{ 
				test: /\.(html|css)$/, 
				loader: 'html-loader',
				exclude: /\.async\.(html|css)$/
			},{
				test: /\.async\.(html|css)$/, 
				loaders: [ 'file-loader?name=[name].[hash].[ext]', 'extract' ]
			},{
				test: /\.ts$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'awesome-typescript-loader',
						query: {
							instance: 'client',
							lib: [ 'dom', 'es6' ],
							target: 'es5',
							types: config.types.client.concat([ 'webpack', 'node', 'jasmine' ]),
							baseUrl: './client',
							cacheDirectory: './builds/.client',
							useCache: true
						}
					},
					'angular2-template-loader?keepUrl=true',
					'angular2-router-loader'
				]
			}]
		}
	}
	
	//Create source maps for development or testing
	if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing'){
		module.exports.webpack.plugins.push(
			new webpack.SourceMapDevToolPlugin({
				moduleFilenameTemplate: '/[resource-path]',
				exclude: [ 'vendor', 'libs', 'polyfills' ]
			})
		)
	}
	
	//Add coverage hooks for testing
	if (process.env.NODE_ENV === 'testing'){
		module.exports.webpack.module.rules.splice(0, 0, {
			test: /^((?!test).)*\.ts$/,
			exclude: /(node_modules|bower_components)/,
			loader: 'istanbul-instrumenter-loader'
		})
	}
	
	//Add plugins for browser optimization
	if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production'){
		module.exports.webpack.plugins.push(
			new webpack.optimize.CommonsChunkPlugin({
				name: [ 'main', 'vendor', 'libs', 'polyfills' ]
			})
		)
	}
	
	//Add plugins for distribution
	if (process.env.NODE_ENV === 'production'){
		module.exports.webpack.plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
			new WebpackObfuscator({}, [
				'vendor.js',
				'polyfills.js',
				'libs.js'
			]),
			new WebpackFavicons({
				title: config.name,
				logo: './client/favicon.png',
				prefix: 'favicons/',
				icons: {
					appleStartup: false
				}
			})
		)
	}
	
	//Prepare callback for compilation completion
	const callback = function(err, stats){
		
		//Log stats from build
		console.log(stats.toString({
			chunkModules: false,
			assets: false
		}))
		
		//Beep for success or errors
		if (module.exports.setup && process.env.MODE === 'single'){
			if (stats.hasErrors()){
				beep(2)
			}else{
				beep()
			}
		}else{
			module.exports.setup = true
		}
		
		done(err)
	}
	
	//Compile webpack and watch if developing
	if (process.env.MODE === 'watch'){
		webpack(module.exports.webpack).watch({
			ignored: /(node_modules|bower_components)/
		}, callback)
	}else{
		webpack(module.exports.webpack).run(callback)
	}
})