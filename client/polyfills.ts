//Modules
import 'core-js/es6'
import 'core-js/es7/reflect'
require('zone.js/dist/zone')

//Development
if (process.env.NODE_ENV === 'development') {
	Error.stackTraceLimit = Infinity
	require('zone.js/dist/zone')
}