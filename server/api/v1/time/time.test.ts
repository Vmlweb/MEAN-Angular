//Modules
import * as url from 'url'
import * as request from 'request'
import { config } from 'app'

//Request prototype
const startRequest = (params, checks) => {
	request({
		url: url.resolve('http://' + config.http.url + ':' + config.http.port.internal, '/api/v1/time'),
		method: 'GET',
		json: true,
		body: params
	}, (err, res, body) => {
		
		//Check there was no error in the request
		expect(err).toBeNull()
		expect(res.statusCode).toBe(200)
		
		//Perform coresponding test checks
		checks(body)
	})
}

describe('Time', () => {

	//! Positive Tests

	describe('Positive Tests', () => {

		it('should return stub time', (done) => {
			startRequest({}, (body) => {

				//Check that time matches mock objects time
				//expect(body.time).toBe('Sunday, December 12th 2012, 12:12:12 am')

				done()
			})
	
		})

	})

})