//Includes
import { Collection } from './collection'

//Models
import { User } from 'server/models'

export const collections = [
	new Collection('users', User, require('./users.json'))
]
