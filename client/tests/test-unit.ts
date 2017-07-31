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
import 'rxjs'

//Modules
import * as minimatch from 'minimatch'
import { TestBed } from '@angular/core/testing'
import { platformBrowserDynamicTesting, BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing'

//Includes
const config = require('config')

//Find all test files
const context = (require as any).context('../', true, /\.unit\.+(ts|js)/)

//Check whether test plan is in used
if (process.env.hasOwnProperty('TEST_PLAN')){
	
	//Create default test
	describe('Client Testing', () => { it(process.env.TEST_PLAN + ' tests', () => {}) })
	
	//Loop through each test and plan matcher
	testLoop: for (const test of context.keys()){
		for (const matcher of config.tests.client[process.env.TEST_PLAN]){
			
			//Check for match and execute test
			if (minimatch(test.slice(2), matcher + '.unit.+(ts|js)')){
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