//Modules
const moment = require('moment');

//Constructor
function Time(){
	
	//Properties
	this.format = 'ddd, hA';
}

//Methods
Time.prototype.getTime = function(){
	return moment().format(this.format);
};

module.exports = Time;