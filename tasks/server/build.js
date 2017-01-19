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
module.exports = { setup: false, reload: false, webpack: undefined }

/*! Tasks
- server.build
- server.build.reload
*/

//! Build
gulp.task('server.build', function(done){
	
	//Generate list of file paths to exclude
	let nodeModules = {}
	fs.readdirSync('node_modules').filter(function(x) { return ['.bin'].indexOf(x) === -1 }).forEach(function(mod) { nodeModules[mod] = 'commonjs ' + mod })
	nodeModules['config'] = 'commonjs ../config.js'
	
	//Create webpack options
	module.exports.webpack = {
		entry: process.env.NODE_ENV === 'testing' ? './server/test.ts' : './server/main.ts',
		target: 'node',
		externals: nodeModules,
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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
			extensions: [ '.js', '.ts' ],
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
					types: config.types.server.concat([ 'webpack', 'webpack-env', 'node', 'rewire', 'jasmine' ]),
					baseUrl: './server',
					cacheDirectory: './builds/.server',
					useCache: true
				}
			}]
		}
	}
	
	//Add inline source maps for development and testing
	if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing'){
		module.exports.webpack.plugins.push(
			new webpack.SourceMapDevToolPlugin({
				moduleFilenameTemplate: '/[resource-path]',
				exclude: [ 'test' ]
			})
		)
	}
	
	//Add optimization plugins for distribution
	if (process.env.NODE_ENV === 'production'){
		module.exports.webpack.plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
			new WebpackObfuscator()
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
	
	//Prepare callback for compilation completion
	let callback = function(err, stats){
		
		//Log stats from build
		console.log(stats.toString({
			chunkModules: false,
			assets: false
		}))
		
		//Beep for success or errors
		if (process.env.NODE_ENV === 'development' && module.exports.setup){
			if (stats.hasErrors()){
				beep(2)
			}else{
				beep()
			}
		}
		
		//Reset build status variables
		module.exports.setup = true
		module.exports.reload = true
		
		done(err)
	}
	
	//Compile webpack and watch if developing
	if (process.env.NODE_ENV === 'development'){
		webpack(module.exports.webpack).watch({
			ignored: /node_modules/
		}, callback)
	}else{
		webpack(module.exports.webpack).run(callback)
	}
})

//! Wait
gulp.task('server.build.reload', function(done){
	let interval = setInterval(function(){
		if (module.exports.reload){
			module.exports.reload = false
			clearInterval(interval)
			done()
		}
	}, 400)
})