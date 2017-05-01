//Modules
import * as validate from 'the-vladiator'

//Includes
import { IHandler, Method, Endpoint } from 'app'
import { ErrorCode, ErrorMessage } from 'shared'
import { User } from 'models'

const execute: IHandler = async (req, res, next) => {

	//Collect request parameters
	const limit = req.query.limit ? parseInt(req.query.limit) || -1 : undefined
	
	//Validate parameter contents
	validate(limit).isOptional().isNumber().isPositive().throws(ErrorCode.USR_InvalidLimit)
	
	//Create query to user
	const query = User.find()
	
	//Limit users returned
	if (limit){ query.limit(limit) }
	
	//Execute query
	const users = await query.exec()
	
	res.json({
		users: users.map(user => {
			return {
				userId: user.id,
				username: user.username,
				email: user.email
			}
		})
	})
}

export const endpoint = new Endpoint({

	//! Endpoint
	url: '/users',
	method: Method.Get,
	execute,

	//! Documentation
	title: 'List Users',
	description: 'List users in the database sorted by user id.',
	errors: {
		USR_InvalidLimit: ErrorMessage[ErrorCode.USR_InvalidLimit]
	},

	//! Layouts
	parameters: {
		request: {
			limit: 'Limit the number of results.'
		},
		response: {
			users: {
				userId: 'Identifier of the user.',
				username: 'Username of the user.',
				email: 'E-mail address of the user.'
			}
		}
	},
	example: {
		request: '?limit=3',
		response: {
			user: [
				{ userId: '607f1f77bcf86cd799439011', username: 'FirstUser', email: 'FirstUser@FirstUser.com' },
				{ userId: '607f1f77bcf86cd799439012', username: 'SecondUser', email: 'SecondUser@SecondUser.com' },
				{ userId: '607f1f77bcf86cd799439013', username: 'ThirdUser', email: 'ThirdUser@ThirdUser.com' }
			]
		}
	}
})