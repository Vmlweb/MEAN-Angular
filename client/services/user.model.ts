export class User{
	
	userId: string;
	username: string;
	email: string;
	
	constructor(userId: string, username: string, email: string){
		this.userId = userId;
		this.username = username;
		this.email = email;
	}
}