//Modules
import * as moment from 'moment'

export class Time{

	format: string

	//Init with default time format	
	constructor(format = 'dddd, MMMM Do YYYY'){
		this.format = format
	}

	//Return time using time format	
	getTime(){
		return moment().format(this.format)
	}
}