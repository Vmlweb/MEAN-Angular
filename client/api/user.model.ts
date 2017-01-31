export interface IUserAction {
	username: string
	email: string
}

export interface IUser {
	userId: string
	username: string
	email: string
}

export class User {
	
	userId: string
	username: string
	email: string
	
	constructor(user: IUser){
		this.userId = user.userId
		this.username = user.username
		this.email = user.email
	}
}