//Modules
import * as rl from 'readline'
import * as minimatch from 'minimatch'

//Includes
const config = require('config')
import { shutdown } from 'main'
import { database, log } from 'app'
import { collections } from './collection-list'

//Load collections management
import './'

//Wait for database connection
beforeAll(done => {
	database.once('open', done)
	database.once('error', done)
})

//Populate all collections with default test data
beforeAll(done => {
		
	//Loop through each collection and reset
	Promise.all(collections.map(col => col.reset()))
		.then(() => { done() })
		.catch((err) => {
			log.error('Error resetting test data for all collections before tests', err)
			done()
		})
})

//Reset all collections that have been changed with default data
beforeEach(done => {
	
	//Loop through each modified collection and reset
	Promise.all(collections.filter(col => col.modified).map(col => col.reset()))
		.then(() => { done() })
		.catch((err) => {
			log.error('Error resetting test data for modified collections before test', err)
			done()
		})
})

//Shutdown when tests finished
afterAll(done => {
	shutdown(done)
})

//Find all test files
const context = require.context('../', true, /\.unit\.+(ts|js)/)

//Check whether test plan is in used
if (process.env.hasOwnProperty('TEST_PLAN')){
	
	//Create default test
	describe('Server Tests', () => { it(process.env.TEST_PLAN + ' tests', () => {}) })
	
	//Loop through each test and plan matcher
	testLoop: for (const test of context.keys()){
		for (const matcher of config.tests.server[process.env.TEST_PLAN]){
			
			//Check for match and execute test
			if (minimatch(test.slice(2), matcher + '.unit.+(ts|js)')){
				context(test)
				continue testLoop
			}
		}
	}
}else{
	
	//Create default test
	describe('Server Tests', () => { it('all tests', () => {}) })
	
	//Execute all tests
	context.keys().forEach(context)
}

//Handle windows watch shutdown
if (process.platform === 'win32'){
	rl.createInterface({ input: process.stdin, output: process.stdout }).on('SIGINT', () => { shutdown() })
}

export { shutdown }