//Modules
import * as validate from 'the-vladiator'

//Includes
import { IHandler, Method, Endpoint, log } from 'app'
import { ErrorCode, ErrorMessage } from 'shared'
import { User } from 'models'

const execute: IHandler = async (req, res, next) => {
	
	//Collect request parameters
	const userId = req.params.userId
	
	//Validate parameter contents
	validate(userId).isRequired().isMongoId().throws(ErrorCode.USR_Invalid)
	
	//Find and remove user
	if (!await User.findByIdAndRemove(userId)){
		throw ErrorCode.USR_NotFound
	}
	
	log.info('User ' + userId + ' removed')
	
	res.json({})
}

export const endpoint = new Endpoint({
	
	//! Endpoint
	url: '/users/:userId',
	method: Method.Delete,
	execute,
	
	//! Documentation
	title: 'Delete User',
	description: 'Deletes a specific user from the database.',
	errors: {
		USR_Invalid: ErrorMessage[ErrorCode.USR_Invalid],
		USR_NotFound: ErrorMessage[ErrorCode.USR_NotFound]
	},
	
	//! Layouts
	parameters: {
		request: {
			userId: 'Identifier of user to remove.'
		}
	},
	example: {
		request: '/607f1f77bcf86cd799439014'
	}
})