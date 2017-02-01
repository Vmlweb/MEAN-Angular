//Modules
import * as validate from 'the-vladiator'

//Includes
import { IHandler, Method, Endpoint, log } from 'app'
import { ErrorCode, ErrorMessage } from 'shared'
import { User } from 'models'

const execute: IHandler = async (req, res, next) => {

	//Collect request parameters
	const userId = req.params.userId
	const username = req.body.username
	const email = req.body.email
	
	//Validate parameter contents
	validate(userId).isRequired().isMongoId().throws(ErrorCode.USR_Invalid)
	validate(username).isRequired().isString().notEmpty().throws(ErrorCode.USR_InvalidUsername)
	validate(email).isRequired().isEmail().throws(ErrorCode.USR_InvalidEmail)
	
	//Find and update user
	if (!await User.findByIdAndUpdate(userId, { username, email })){
		throw ErrorCode.USR_NotFound
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
		USR_Invalid: ErrorMessage[ErrorCode.USR_Invalid],
		USR_InvalidUsername: ErrorMessage[ErrorCode.USR_InvalidUsername],
		USR_InvalidEmail: ErrorMessage[ErrorCode.USR_InvalidEmail],
		USR_NotFound: ErrorMessage[ErrorCode.USR_NotFound]
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