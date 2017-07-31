//Modules
import * as rl from 'readline'
import * as minimatch from 'minimatch'
import * as fs from 'fs'
import { defineSupportCode } from 'cucumber'

//Includes
const config = require('config')
import { shutdown } from 'main'
import { database, log } from 'app'
import { collections } from './collection-list'

//Load collections management
import './'

//Register hooks with cucumber
defineSupportCode(({ registerHandler }) => {

	//Wait for database connection
	registerHandler('BeforeFeatures', (features, done) => {
		database.once('open', done)
		database.once('error', done)
	})
	
	//Populate all collections with default test data
	registerHandler('BeforeFeatures', (feature, done) => {
			
		//Loop through each collection and reset
		Promise.all(collections.map(col => col.reset()))
			.then(() => { done() })
			.catch((err) => {
				log.error('Error resetting test data for all collections before tests', err)
				done()
			})
	})
	
	//Reset all collections that have been changed with default data
	registerHandler('BeforeScenario', (scen, done) => {
		
		//Loop through each modified collection and reset
		Promise.all(collections.filter(col => col.modified).map(col => col.reset()))
			.then(() => { done() })
			.catch((err) => {
				log.error('Error resetting test data for modified collections before test', err)
				done()
			})
	})
	
	//Shutdown when tests finished
	registerHandler('AfterFeatures', (features, done) => {
		shutdown(done)
	})

})

//Find all step files files and execute
const context = require.context('../', true, /\.step\.+(ts|js)/)
context.keys().forEach(context)

//Handle windows watch shutdown
if (process.platform === 'win32'){
	rl.createInterface({ input: process.stdin, output: process.stdout }).on('SIGINT', () => { shutdown() })
}

//Write coverage to file before exit
process.on('exit', () => {
	const coverage = JSON.stringify(global['__coverage__'])
	fs.writeFileSync('./logs/tests/server/feature/coverage.json', coverage)
})

export { shutdown }