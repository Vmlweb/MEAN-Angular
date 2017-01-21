//Modules
import * as moment from 'moment'

//Mocks
const Time = require('inject-loader!time/time')({
	moment: () => { return moment(948214737000) }
}).Time

describe('Time', () => {
	
	it('return correct time in default format', () => {
		const time = new Time()
		expect(time.getTime()).toBe('Tuesday, January 18th 2000')
	})
	
	it('return ISO string when empty format given', () => {
		const time = new Time('')
		expect(time.getTime()).toBe('2000-01-18T16:58:57+00:00')
	})
	
	it('return correct time in specified format', () => {
		const time = new Time('dddd, MMMM Do YYYY, h:mm:ss a')
		expect(time.getTime()).toBe('Tuesday, January 18th 2000, 4:58:57 pm')
	})
	
})