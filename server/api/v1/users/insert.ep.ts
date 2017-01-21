//Includes
import { log, Method, Endpoint, ErrorCode, ClientError } from 'app'
import { User } from 'models'

const execute = async (req, res) => {
	
	//Check required parameters
	const username = req.body.username || ''
	const email = req.body.email || ''
	
	//Validate parameter fields
	if (typeof username !== 'string' || username.length <= 0){ throw new ClientError(ErrorCode.UsernameMissing) }
	if (typeof email !== 'string' || email.length <= 0){ throw new ClientError(ErrorCode.EmailMissing) }
	
	//Create new user
	const user = await User.create({
		username,
		email
	})
	
	log.info('User ' + user.id.toString() + ' created')
	
	res.json({
		userId: user.id.toString()
	})
}

export const endpoint = new Endpoint({
	
	//! Endpoint
	url: '/users',
	method: Method.Post,
	execute,
	
	//! Documentation
	title: 'Insert User',
	description: 'Insert a new user into the database.',
	
	//! Layouts
	parameters: {
		request: {
			username: 'Username for the user to add',
			email: 'E-mail address for the user to add'
		},
		response: {
			userId: 'Identifier of the user'
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