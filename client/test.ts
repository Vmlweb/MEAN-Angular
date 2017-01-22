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
let config = require('config')
import * as minimatch from 'minimatch'
import { TestBed } from '@angular/core/testing'
import { platformBrowserDynamicTesting, BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing'

//Find all test files
const context = (require as any).context('./', true, /\.test\.(ts|js)/)

//Check whether test plan is in used
if (process.env.hasOwnProperty('TEST')){
	
	//Create default test
	describe('Client Testing', () => { it(process.env.TEST + ' tests', () => {}) })
	
	//Loop through each test and plan matcher
	testLoop: for (const test of context.keys()){
		for (const matcher of config.tests.client[process.env.TEST]){
			
			//Check for match and execute test
			if (minimatch(test.slice(2), matcher + '.test.+(ts|js)')){
				context(test)
				continue testLoop
			}
		}
	}
}else{
	
	//Create default test
	describe('Client Testing', () => { it('all tests', () => {}) })
	
	//Execute all tests
	context.keys().forEach(context)
}

//Setup angular testing enviroment
Error.stackTraceLimit = Infinity
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())