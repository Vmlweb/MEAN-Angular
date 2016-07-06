//Modules
const mock =  require('mock-require');

//Create stub object
let Time = require('./time.js');
Time.prototype.getTime = function(){
	return 'Sunday, December 12th 2012, 12:12:12 am';
};

//Apply stub object
mock('./time.js', Time);