//Modules
import * as validate from 'the-vladiator'

//Includes
import { ErrorCode, ClientError } from 'shared'
import { log, Method, Endpoint } from 'app'
import { User } from 'models'

const execute = async (req, res, next) => {

	//Collect request parameters
	const userId = req.params.userId
	const username = req.body.username
	const email = req.body.email
	
	//Validate parameter contents
	validate(userId).isRequired().isMongoId().throws(new ClientError(ErrorCode.USR_Invalid))
	validate(username).isRequired().isString().notEmpty().throws(new ClientError(ErrorCode.USR_InvalidUsername))
	validate(email).isRequired().isEmail().throws(new ClientError(ErrorCode.USR_InvalidEmail))
	
	//Find and update user
	if (!await User.findByIdAndUpdate(userId, { username, email })){
		throw new ClientError(ErrorCode.USR_NotFound)
	}
	
	log.info('User ' + userId + ' updated')
	
	res.json({})
}

export const endpoint = new Endpoint({

	//! Endpoint
	url: '/users/:userId',
	method: Method.Put,
	execute,

	//! Documentation
	title: 'Update User',
	description: 'Update a specific users details.',
	errors: {
		USR_Invalid: 'User identifier was not specified or invalid.',
		USR_InvalidUsername: 'Username was not specified or is invalid.',
		USR_InvalidEmail: 'E-mail address was not specified or is invalid.',
		USR_NotFound: 'User with identifier could not be found.'
	},
	
	//! Layouts
	parameters: {
		request: {
			userId: 'Identifier of the user to update.',
			username: 'New username to apply to user.',
			email: 'New e-mail address to apply to user.'
		},
		response: {
			userId: 'Identifier of the user.'
		}
	},
	example: {
		request: {
			userId: '607f1f77bcf86cd799439013',
			username: 'NewUsername',
			email: 'NewEmail@NewEmail.com'
		}
	}
})