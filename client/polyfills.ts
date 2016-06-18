//Includes
import 'core-js/es6';
import 'reflect-metadata';
require('zone.js/dist/zone');

//Debugging
if (process.env.ENV === 'dist') {
	Error['stackTraceLimit'] = Infinity;
	require('zone.js/dist/long-stack-trace-zone');
}