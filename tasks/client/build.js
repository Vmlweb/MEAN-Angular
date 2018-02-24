//Modules
const gulp = require('gulp')
const path = require('path')
const beep = require('beepbeep')
const fs = require('fs')
const request = require('request')
const webpack = require('webpack')
const WebpackObfuscator = require('webpack-obfuscator')
const WebpackHTML = require('html-webpack-plugin')
const WebpackExtractText = require("extract-text-webpack-plugin")
const WebpackFavicons = require('favicons-webpack-plugin')
const WebpackCSSMinify = require('optimize-css-assets-webpack-plugin')
const PathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin
const CompressPlugin = require('compression-webpack-plugin')
const BrowserSync = require('browser-sync')

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

	//Default to development
	if (!process.env.NODE_ENV){
		process.env.NODE_ENV = 'development'
	}

	//Check whether libs are built
	const libsExist = fs.existsSync('./builds/client/libs.json') && fs.existsSync('./builds/client/vendor.json')

	//Setup browser sync
	let bs
	if (process.env.MODE === 'watch'){
		const check = setInterval(() => {

			//Check whether test server is live
			request('http://' + config.http.url + ':' + config.http.port.external, (err, response, body) => {
				if (!err){

					//Setup browsersync
					bs = BrowserSync.create()
					bs.init({
						port: 58003,
						proxy: {
							target: config.http.url + ':' + config.http.port.external,
							ws: true
						}
					})

					//Stop timer
					clearInterval(check)
				}
			})

		}, 1000)
	}

	//Build webpack with or without libs
	const build = function(libs){

		//Define entry points for each enviroment
		let entry
		if (process.env.NODE_ENV === 'testing'){
			if (process.env.TEST === 'unit'){
				entry = {
					main: './client/tests/test-unit.ts'
				}
			}else if (process.env.TEST === 'feature'){
				entry = {
					main: './client/tests/test-feature.ts'
				}
			}
		}else if (process.env.NODE_ENV === 'development'){
			if (libs){
				entry = {
					vendor: [ './client/vendor.ts' ],
					libs: [ './client/libs.ts' ]
				}
			}else{
				entry = {
					polyfills: './client/polyfills.ts',
					main: process.env.THEME ? [ './client/main.ts', 'semantic-ui-less/semantic.less' ] : './client/main.ts'
				}
			}
		}else{
			entry = {
				polyfills: './client/polyfills.ts',
				vendor: './client/vendor.ts',
				libs: './client/libs.ts',
				main: './client/main.ts'
			}
		}

		//Prepare variables for dll add-ons
		let jsDlls = []
		let cssDlls = []
		if (process.env.NODE_ENV === 'development' && !libs){
			if (!process.env.THEME){
				cssDlls.push('style.css')
			}
			jsDlls.push('libs.js', 'vendor.js')
		}

		//Create options
		const setup = {
			entry: entry,
			target: 'web',
			plugins: [
				new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/, './client'),
				new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)@angular/, './client'),
				new webpack.DefinePlugin({
					'process.env.ENV': JSON.stringify(process.env.NODE_ENV),
					'process.env.TEST': JSON.stringify(process.env.TEST),
					'process.env.TEST_PLAN': JSON.stringify(process.env.TEST_PLAN),
					'process.env.MODE': JSON.stringify(process.env.MODE),
					'process.env.URL': JSON.stringify(process.env.NODE_ENV === 'testing' ? ('http://' + config.http.url + ':' + config.http.port.internal) : '')
				}),
				new WebpackHTML({
					title: config.name.replace(/_/, ' '),
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
					js: jsDlls.concat(config.libs.filter(function(lib){
							return lib.endsWith('.js')
						}).map(function(lib){
							return '/libs/' + path.basename(lib)
						})),
					css: cssDlls.concat(config.libs.filter(function(lib){
							return lib.endsWith('.css')
						}).map(function(lib){
							return '/libs/' + path.basename(lib)
						}))
				}),
				new webpack.ProvidePlugin({
					$: 'jquery',
					jQuery: 'jquery'
				}),
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
				path: path.resolve('./builds/client'),
				filename: '[name].js'
			},
			resolve: {
				unsafeCache: true,
				modules: [ './node_modules', './bower_components' ],
				extensions: [ '.js', '.ts', '.json', '.png', '.jpg', '.jpeg', '.gif' ],
				alias: {
					config: path.resolve('./config.js'),
					shared: path.resolve('./shared'),
					client: path.resolve('./client')
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
					test: /\.css$/,
					use: WebpackExtractText.extract('css-loader'),
					exclude: /(\.async\.css$|client)/
				},{
					test: /\.html$/,
					loader: 'html-loader',
					exclude: /\.async\.html$/
				},{
					test: /\.css$/,
					loaders: [ 'to-string-loader', 'css-loader' ],
					exclude: /(\.async\.css$|node_modules)/
				},{
					test: /\.async\.(html|css)$/,
					loaders: [ 'file-loader?name=assets/[hash].[ext]', 'extract' ]
				},{
					test: /\.less$/,
					include: /[\/\\]node_modules[\/\\]semantic-ui-less[\/\\]/,
					use: WebpackExtractText.extract({
						use: [{
							loader: 'css-loader',
							options: {
								importLoaders: 1,
								minimize: true
							}
						},{
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
						  		module: "commonjs",
								paths: {
									config: [ path.resolve('./config.js') ],
									shared: [ path.resolve('./shared') ],
									'client/*': [ path.resolve('./client/*') ]
								}
							}
						},
						'angular2-template-loader?keepUrl=true',
						'angular2-router-loader'
					]
				}]
			}
		}

		//Add dll plugins for development
		if (process.env.NODE_ENV === 'development'){
			if (libs){

				//Add dll creation plugins
				setup.output.library = '[name]'
				setup.plugins.push(
					new webpack.DllPlugin({
						name: '[name]',
						path: './builds/client/[name].json'
					})
				)
			}else{

				//Load dll lib manifest
				const dllLibs = require('../../builds/client/libs.json')

				//Remove semantic if in theme mode
				if (process.env.THEME){
					delete dllLibs.content['./node_modules/semantic-ui-less/semantic.less']
				}

				//Add dll connection plugins
				setup.plugins.push(
					new webpack.DllReferencePlugin({
						context: '.',
						manifest: require('../../builds/client/vendor.json')
					}),
					new webpack.DllReferencePlugin({
						context: '.',
						manifest: dllLibs
					})
				)
			}
		}

		//Add css collectors
		if (process.env.NODE_ENV === 'development' && !process.env.THEME && !libs){}else{
			setup.plugins.push(new WebpackExtractText({
				filename: 'style.css',
				allChunks: true
			}))
		}

		//Add source map plugins for development
		if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing'){
			setup.plugins.push(
				new webpack.SourceMapDevToolPlugin({
					moduleFilenameTemplate: '/[resource-path]',
					exclude: [ 'vendor', 'libs', 'polyfills' ]
				})
			)
		}

		//Add coverage hook plugins for testing
		if (process.env.NODE_ENV === 'testing'){
			setup.module.rules.splice(0, 0, {
				test: /^((?!unit|step).)*\.ts$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'istanbul-instrumenter-loader'
			})
		}

		//Add partial optimization plugins for development
		if ((process.env.NODE_ENV === 'development' && !libs) || process.env.NODE_ENV === 'production'){
			setup.plugins.push(
				new webpack.optimize.CommonsChunkPlugin({
					name: [ 'main', 'vendor', 'libs', 'polyfills' ]
				})
			)
		}

		//Add full optimization plugins for distribution
		if (process.env.NODE_ENV === 'production'){
			setup.plugins.push(
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
				})/*,
				new WebpackObfuscator({},
					[ 'vendor.js', 'polyfills.js', 'libs.js' ]
				)*/
			)
		}

		//Prepare callback for compilation completion
		const callback = function(err, stats){

			//Reload browser
			if (bs){
				bs.reload()
			}

			//Log stats from build
			console.log(stats.toString({
				chunkModules: false,
				assets: false
			}))

			//Beep for success or errors
			if (module.exports.setup && process.env.NODE_ENV === 'development' && process.env.MODE === 'watch' && !libs){
				if (stats.hasErrors()){
					beep(2)
				}else{
					beep()
				}
			}

			//Direct build for client when libs complete
			if (libs){
				build(false)
			}else{

				//Set build status variables
				module.exports.webpack = setup
				module.exports.setup = true

				done(err)
			}
		}

		//Compile webpack and watch if developing
		if (process.env.MODE === 'watch' && !libs){
			webpack(setup).watch({
				ignored: /(node_modules|bower_components)/
			}, callback)
		}else{
			webpack(setup).run(callback)
		}
	}

	//Direct build for libs or client
	if (process.env.NODE_ENV === 'development' && !libsExist){
		build(true)
	}else{
		build(false)
	}
})
