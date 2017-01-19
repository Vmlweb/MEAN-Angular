//Includes
import { Method, Endpoint, log } from 'app'
import { User } from 'models'

const execute = async (req, res) => {
	
	//Check required parameters
	let username = req.body.username || ''
	let email = req.body.email || ''
	
	//Validate parameter fields
	if (typeof username != 'string' || username.length <= 0){ throw 'Username must be given' }
	if (typeof email != 'string' || email.length <= 0){ throw 'E-mail address must be given' }
	
	//Create new user
	let user = await User.create({
		username: username,
		email: email
	})
	
	log.info('User ' + user.id.toString() + ' created')
	
	res.json({
		userId: user.id.toString()
	})
}

export default new Endpoint({
	
	//! Endpoint
	url: '/users',
	method: Method.Post,
	execute: execute,
	
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