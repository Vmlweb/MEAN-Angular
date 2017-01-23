//Modules
import * as minimatch from 'minimatch'

//Includes
import { config } from 'shared'
import { shutdown } from 'main'
import { database } from 'app'

//Wait for database connection
beforeAll(done => {
	database.once('open', done)
	database.once('error', done)
})

//Load testing hooks
import 'tests'

//Find all test files
const context = require.context('./', true, /\.test\.(ts|js)/)

//Check whether test plan is in used
if (process.env.hasOwnProperty('TEST')){
	
	//Create default test
	describe('Server Tests', () => { it(process.env.TEST + ' tests', () => {}) })
	
	//Loop through each test and plan matcher
	testLoop: for (const test of context.keys()){
		for (const matcher of config.tests.server[process.env.TEST]){
			
			//Check for match and execute test
			if (minimatch(test.slice(2), matcher + '.test.+(ts|js)')){
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

//Shutdown when tests finished
afterAll(done => {
	shutdown(done)
})

export { shutdown }