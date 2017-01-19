//Modules
import * as async from 'async'

//Includes
import { Method, Endpoint, log } from 'app'
import { User } from 'models'

const execute = (req, res, next) => {
	
	//Check required parameters
	let userId = req.params.userId || ''
	let username = req.body.username || ''
	let email = req.body.email || ''
	
	//Validate parameter fields
	if (userId.length <= 0){ return next('User identifier must be given') } 
	if (username.length <= 0){ return next('Username must be given') }
	if (email.length <= 0){ return next('E-mail address must be given') }
	
	//Update user details
	User.findByIdAndUpdate(userId, {
		username: username,
		email: email
	}, (err, user) => {
		if (err){
			next(err)
		}else{
			log.info('User ' + user.id.toString() + ' updated')
			res.json({
				userId: user.id.toString()
			})
		}
	})
}

export default new Endpoint({
	
	//! Endpoint
	url: '/users/:userId',
	method: Method.Put,
	execute: execute,
	
	//! Documentation
	title: 'Update User',
	description: 'Update a specific users details.',
	errors: {},
	
	//! Layouts
	parameters: {
		request: {
			userId: 'Identifier of the user to update',
			username: 'New username to apply to user',
			email: 'New email address to apply to user'
		},
		response: {
			userId: 'Identifier of the user'
		}
	},
	example: {
		request: {
			userId: '607f1f77bcf86cd799439013',
			username: 'NewUsername',
			email: 'NewEmail@NewEmail.com'
		},
		response: {
			userId: '607f1f77bcf86cd799439013'
		}
	}
})