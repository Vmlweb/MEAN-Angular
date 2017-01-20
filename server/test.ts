//Modules
import * as minimatch from 'minimatch'

//Includes
import { shutdown } from 'main'
import { log, database } from 'app'

//Wait for database connection
beforeAll(done => {
	database.once('open', done)
	database.once('error', done)
})

import 'tests'

//Find all test files
let context = require.context('./', true, /\.test\.ts/)

//Check whether test plan is in used
if (process.env.hasOwnProperty('TEST')){
	
	log.info('Filtering tests for plan ' + process.env.TEST)
	
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

//Close app when finished
afterAll(shutdown)

export { shutdown }