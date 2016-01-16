//Modules
var gulp = require("gulp");
var Karma = require("karma").Server;

/* !Tasks 
- client.test
- client.test.karma
*/

// !Test
gulp.task("client.test", gulp.series(
	gulp.parallel("stop"),
	gulp.parallel("clean"),
	gulp.parallel("client.build", "build.config"),
	gulp.parallel("client.test.karma")
));

//Test client with karma
gulp.task("client.test.karma", function(done){
	
	//Setup configuration
	var server = new Karma({
		basePath: "",
		frameworks: ["jasmine"],
		plugins: ["karma-phantomjs2-launcher", "karma-jasmine", "karma-mocha-reporter"],
		browsers: ["PhantomJS2"],
		colors: true,
		autoWatch: false,
		singleRun: true,
		files: [
			//Modules
			{ pattern: "node_modules/systemjs/dist/system-polyfills.js", included: true },
			{ pattern: "node_modules/systemjs/dist/system.src.js", included: true },
			{ pattern: "node_modules/es6-shim/es6-shim.js", included: true },
			{ pattern: "node_modules/rxjs/bundles/Rx.js", included: true },
			{ pattern: "node_modules/angular2/bundles/angular2-polyfills.js", included: true },
			//AngularJS
			{ pattern: "node_modules/angular2/bundles/angular2.js", included: true },
			{ pattern: "node_modules/angular2/bundles/router.dev.js", included: true },
			{ pattern: "node_modules/angular2/bundles/http.dev.js", included: true },
			{ pattern: "node_modules/angular2/bundles/testing.dev.js", included: true },
			//Karma
			{ pattern: "karma.shim.js", included: true },
			//Source
			{ pattern: "builds/client/**/*.js", included: false },
			{ pattern: "builds/client/**/*.js.map", included: false },
		],
		reporters: ["mocha"]
	}, function(){
		done();
	});
	
	//Start server
	server.start();
});