//Includes
import { Method, Endpoint, ServerError } from 'app'
import { User } from 'models'

const execute = async (req, res, next) => {

	//Check for all required parameters
	const limit: number = req.query.limit ? parseInt(req.query.limit) : -1

	//Construct find users database query
	const query = User.find().sort('username')
	if (limit > 0){ query.limit(limit) }

	//Execute query and return users
	let users
	try{
		users = await query.exec()
	}catch(err){
		throw new ServerError('Could not query database for users list')
	}

	res.json({
		users: users.map(user => {
			return {
				userId: user.id.toString(),
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
	title: 'Get Users',
	description: 'Gets a list of users from the database with a limit.',

	//! Layouts
	parameters: {
		request: {
			limit: 'Limit the number of results'
		},
		response: {
			users: {
				userId: 'Identifier of the user',
				username: 'Username of the user',
				email: 'E-mail address of the user'
			}
		}
	},
	example: {
		request: '?limit=5',
		response: {
			user: [
				{ userId: '607f1f77bcf86cd799439011', username: 'FirstUser', email: 'FirstUser@FirstUser.com' },
				{ userId: '607f1f77bcf86cd799439012', username: 'SecondUser', email: 'SecondUser@SecondUser.com' },
				{ userId: '607f1f77bcf86cd799439013', username: 'ThirdUser', email: 'ThirdUser@ThirdUser.com' }
			]
		}
	}
})