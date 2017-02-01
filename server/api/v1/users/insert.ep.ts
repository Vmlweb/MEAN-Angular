//Modules
import * as validate from 'the-vladiator'

//Includes
import { ErrorCode, ErrorMessage } from 'shared'
import { log, Method, Endpoint } from 'app'
import { User } from 'models'

const execute = async (req, res, next) => {

	//Collect request parameters
	const username = req.body.username
	const email = req.body.email
	
	//Validate parameter contents
	validate(username).isRequired().isString().notEmpty().throws(ErrorCode.USR_InvalidUsername)
	validate(email).isRequired().isEmail().throws(ErrorCode.USR_InvalidEmail)
	
	//Create new user
	const user = await User.create({ username, email })
	
	log.info('User ' + user.id + ' created')
	
	res.json({
		userId: user.id
	})
}

export const endpoint = new Endpoint({
	
	//! Endpoint
	url: '/users',
	method: Method.Post,
	execute,
		
	//! Documentation
	title: 'Create User',
	description: 'Create new user in the database.',
	errors: {
		USR_InvalidUsername: ErrorMessage[ErrorCode.USR_InvalidUsername],
		USR_InvalidEmail: ErrorMessage[ErrorCode.USR_InvalidEmail]
	},
	
	//! Layouts
	parameters: {
		request: {
			username: 'Username for the user to create.',
			email: 'E-mail address for the user to create.'
		},
		response: {
			userId: 'Identifier of the created user.'
		}
	},
	example: {
		request: {
			username: 'MyUsername',
			email: 'MyEmail@MyEmail.com'
		},
		response: {
			userId: '607f1f77bcf86cd799439014'
		}
	}
})