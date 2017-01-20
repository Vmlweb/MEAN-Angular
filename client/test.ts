//Libs
import 'core-js/es6'
import 'core-js/es7/reflect'
import 'zone.js/dist/zone'
import 'zone.js/dist/long-stack-trace-zone'
import 'zone.js/dist/proxy'
import 'zone.js/dist/sync-test'
import 'zone.js/dist/jasmine-patch'
import 'zone.js/dist/async-test'
import 'zone.js/dist/fake-async-test'

//Modules
import * as minimatch from 'minimatch'
import { TestBed } from '@angular/core/testing'
import { platformBrowserDynamicTesting, BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing'

//Find all test files
let context = (require as any).context('./', true, /\.test\.ts/)

//Check whether test plan is in used
if (process.env.hasOwnProperty('TEST')){
	
	console.log('Filtering tests for plan ' + process.env.TEST)
	
	//Loop through each test and plan matcher
	testLoop: for (let test of context.keys()){
		for (let matcher of process.env.CONFIG.tests[process.env.TEST]){
			
			//Check for match and execute test
			if (minimatch(test, matcher)){
				context(test)
				continue testLoop
			}
		}
	}
}else{
	
	//Execute all tests
	context.keys().forEach(context)
}

//Setup angular testing enviroment
Error.stackTraceLimit = Infinity
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());