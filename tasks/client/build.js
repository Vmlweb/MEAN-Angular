//Modules
const gulp = require('gulp')
const path = require('path')
const beep = require('beepbeep')
const fs = require('fs')
const webpack = require('webpack')
const WebpackObfuscator = require('webpack-obfuscator')
const WebpackHTML = require('html-webpack-plugin')
const WebpackExtractText = require("extract-text-webpack-plugin")
const WebpackFavicons = require('favicons-webpack-plugin')
const WebpackCSSMinify = require('optimize-css-assets-webpack-plugin')
const PathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin
const CompressPlugin = require('compression-webpack-plugin')
const InstallerPlugin = require('npm-install-webpack-plugin')

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
gulp.task('client.build.libs', function(done){
	if (config.libs.length > 0){
		return gulp.src(config.libs)
			.pipe(gulp.dest('builds/client/libs'))
	}else{
		done()
	}
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
				'process.env.URL': JSON.stringify(process.env.NODE_ENV === 'testing' ? ('http://' + config.http.url + ':' + config.http.port.internal) : '')
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
			}),
			/*new InstallerPlugin({
				dev: true,
				peerDependencies: true,
				quiet: false
			}),*/
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery'
			}),
			new WebpackExtractText('style.css'),
			new CheckerPlugin()
		],
		performance: {
			hints: false
		},
		node: {
			console: true,
			fs: 'empty',
			net: 'empty',
			tls: 'empty'
		},
		output: {
			path: './builds/client',
			filename: '[name].js'
		},
		resolve: {
			modules: [ './client', './node_modules', './bower_components' ],
			extensions: [ '.js', '.ts', '.json', '.png', '.jpg', '.jpeg', '.gif' ],
			alias: {
				config: path.resolve('./config.js'),
				shared: path.resolve('./shared')
			},
			plugins: [
				new PathsPlugin()
			]
		},
		module: {
			rules: [{
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
				loader: 'url-loader?limit=10240&name=assets/[hash].[ext]'
			},{ 
				test: /\.(html|css)$/, 
				loader: 'html-loader',
				exclude: /\.async\.(html|css)$/
			},{
				test: /\.async\.(html|css)$/, 
				loaders: [ 'file-loader?name=assets/[hash].[ext]', 'extract' ]
			},{
				test: /\.less$/,
				include: /[\/\\]node_modules[\/\\]semantic-ui-less[\/\\]/,
				use: WebpackExtractText.extract({
					use: [ 'css-loader?importLoaders=1', {
						loader: 'semantic-ui-less-module-loader',
						options: {
							siteFolder: path.join(__dirname, '../../semantic'),
							themeConfigPath: path.join(__dirname, '../../semantic/theme.config')
						}
					}]
				})
			},{
				test: /\.ts$/,
				exclude: /(node_modules|bower_components)/,
				use: [{
						loader: 'awesome-typescript-loader',
						query: {
							instance: 'client',
							lib: [ 'dom', 'es6' ],
							types: config.types.client.concat([ 'webpack', 'node', 'jasmine' ]),
							baseUrl: './client',
							cacheDirectory: './builds/.client',
							useCache: true,
							paths: {
								config: [ path.resolve('./config.js') ],
								shared: [ path.resolve('./shared') ]
							}
						}
					},
					'angular2-template-loader',
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
			new webpack.optimize.UglifyJsPlugin({
				compress: { warnings: false },
				output: { comments: false },
				sourceMap: false
			}),
			new CompressPlugin({
				asset: '[path].gz[query]',
				algorithm: 'gzip',
				test: /\.js$|\.html$/,
				threshold: 10240,
				minRatio: 0.8
			}),
			new WebpackFavicons({
				title: config.name,
				logo: './client/favicon.png',
				prefix: 'favicons/',
				icons: { appleStartup: false }
			}),
			new WebpackCSSMinify({
				cssProcessorOptions: { discardComments: { removeAll: true } }
			}),
			new WebpackObfuscator({}, 
				[ 'vendor.js', 'polyfills.js', 'libs.js' ]
			)
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
		if (module.exports.setup && process.env.NODE_ENV === 'development' && process.env.MODE === 'watch'){
			if (stats.hasErrors()){
				beep(2)
			}else{
				beep()
			}
		}
		
		//Set build status variables
		module.exports.setup = true		
		
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