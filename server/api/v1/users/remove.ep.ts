//Modules
import * as validate from 'the-vladiator'

//Includes
import { log, Method, Endpoint, ErrorCode, ClientError } from 'app'
import { User } from 'models'

const execute = async (req, res, next) => {
	
	//Collect request parameters
	const userId = req.params.userId
	
	//Validate parameter contents
	validate(userId).isRequired().isMongoId().throws(new ClientError(ErrorCode.USR_Invalid))
	
	//Find and remove user
	if (!await User.findByIdAndRemove(userId)){
		throw new ClientError(ErrorCode.USR_NotFound)
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
		USR_Invalid: 'User identifier was not specified or invalid.',
		USR_NotFound: 'User with identifier could not be found.'
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