//Modules
const gulp = require('gulp')
const path = require('path')
const beep = require('beepbeep')
const fs = require('fs')
const webpack = require('webpack')
const WebpackObfuscator = require('webpack-obfuscator')
const PathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin
const { CheckerPlugin } = require('awesome-typescript-loader')

//Config
const config = require('../../config.js')
module.exports = { setup: false, webpack: undefined }

/*! Tasks
- server.build
*/

//Setup webpack for compilation
gulp.task('server.build', function(done){
	
	//Generate list of file paths to exclude from bundle
	const nodeModules = {}
	fs.readdirSync('node_modules').filter(function(x) { return ['.bin'].indexOf(x) === -1 }).forEach(function(mod) { nodeModules[mod] = 'commonjs ' + mod })
	nodeModules['config'] = 'commonjs ' + (process.env.NODE_ENV === 'testing' ? '../../config.js' : '../config.js')
	
	//Create webpack options
	module.exports.webpack = {
		entry: process.env.NODE_ENV === 'testing' ? './server/test.ts' : './server/main.ts',
		target: 'node',
		externals: nodeModules,
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				'process.env.TEST': JSON.stringify(process.env.TEST),
				'process.env.MODE': JSON.stringify(process.env.MODE)
			}),
			new CheckerPlugin({
				fork: true,
				useWebpackText: true
			})
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
				config: '../config.js'
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
					useCache: true
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
			ignored: /node_modules/
		}, callback)
	}else{
		webpack(module.exports.webpack).run(callback)
	}
})