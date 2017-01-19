//Includes
import { log, Method, Endpoint, ErrorCode, ClientError } from 'app'
import { User } from 'models'

const execute = async (req, res, next) => {
	
	//Check required parameters
	let userId = req.params.userId || ''
	
	//Validate parameter fields
	if (typeof userId != 'string' || userId.length <= 0){ return next('User identifier must be given') } 
	
	//Find user in database and remove
	try{
		await User.findByIdAndRemove(userId)
	}catch(err){
		throw new ClientError(ErrorCode.UserMissing)
	}
	
	res.json({
		userId: userId
	})
}

export default new Endpoint({
	
	//! Endpoint
	url: '/users/:userId',
	method: Method.Delete,
	execute: execute,
	
	//! Documentation
	title: 'Delete User',
	description: 'Deletes a specific user from the database.',
	
	//! Layouts
	parameters: {
		request: {
			userId: 'Identifier of user to remove'
		},
		response: {
			userId: 'Identifier of the user'
		}
	},
	example: {
		request: '/607f1f77bcf86cd799439014',
		response: {
			userId: '607f1f77bcf86cd799439014'
		}
	}
})