//Modules
const gulp = require('gulp')
const path = require('path')
const beep = require('beepbeep')
const fs = require('fs')
const webpack = require('webpack')
const WebpackObfuscator = require('webpack-obfuscator')
const PathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin

//Config
const config = require('../../config.js')
module.exports = { setup: false, valid: false, webpack: undefined }

/*! Tasks
- server.build
*/

//Setup webpack for compilation
gulp.task('server.build', function(done){
	
	//Generate list of file paths to exclude from bundle
	const nodeModules = {}
	fs.readdirSync('node_modules').filter(function(x) { return ['.bin'].indexOf(x) === -1 }).forEach(function(mod) { nodeModules[mod] = 'commonjs ' + mod })
	nodeModules['config'] = 'commonjs ../config.js'
	
	//Create webpack options
	module.exports.webpack = {
		entry: process.env.NODE_ENV === 'testing' ? './server/test.ts' : './server/main.ts',
		target: 'node',
		externals: nodeModules,
		watch: true,
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				'process.env.TEST': JSON.stringify(process.env.TEST),
				'process.env.MODE': JSON.stringify(process.env.MODE),
				'process.env.URL': JSON.stringify('http://' + config.http.url + ':' + (process.env.NODE_ENV === 'testing' ? config.http.port.internal : config.http.port.external))
			}),
			new CheckerPlugin()
		],
		performance: {
			hints: false
		},
		output: {
			path: './builds/server',
			filename: '[name].js'
		},
		resolve: {
			modules: [ './server', './node_modules' ],
			extensions: [ '.js', '.ts', '.json' ],
			alias: {
				shared: path.resolve('./shared')
			},
			plugins: [
				new PathsPlugin()
			]
		},
		module: {
			rules: [{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'awesome-typescript-loader',
				query: {
					instance: 'server',
					lib: [ 'es6' ],
					target: 'es5',
					types: config.types.server.concat([ 'webpack', 'webpack-env', 'node', 'jasmine' ]),
					baseUrl: './server',
					cacheDirectory: './builds/.server',
					useCache: true,
					paths: {
						config: [ path.resolve('./config.js') ],
						shared: [ path.resolve('./shared') ]
					}
				}
			}]
		}
	}
	
	//Add inline source maps for development or testing
	if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing'){
		module.exports.webpack.plugins.push(
			new webpack.SourceMapDevToolPlugin({
				moduleFilenameTemplate: '/[resource-path]'
			})
		)
	}
	
	//Add coverage hooks for testing
	if (process.env.NODE_ENV === 'testing'){
		module.exports.webpack.module.rules.splice(0, 0, {
			test: /^((?!test).)*\.ts$/,
			exclude: /node_modules/,
			loader: 'istanbul-instrumenter-loader'
		})
	}
	
	//Add optimization plugins for distribution
	if (process.env.NODE_ENV === 'production'){
		module.exports.webpack.plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
			new WebpackObfuscator()
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
		module.exports.valid = !stats.hasErrors()
		
		done(err)
	}
	
	//Compile webpack and watch if developing
	if (process.env.MODE === 'watch'){
		webpack(module.exports.webpack).watch({
			ignored: /node_modules/
		}, callback)
	}else{
		webpack(module.exports.webpack).run(callback)
	}
})