//Includes
import { Collection } from 'tests'

//Models
import { User } from 'models'

export const collections = [
	new Collection('users', User, require('./users.json'))
]