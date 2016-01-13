//Model
export class User{
	
	//Properties
	userId: string;
	username: string;
	email: string;
	
	//Constructor
	constructor(userId: string, username: string, email: string){
		this.userId = userId;
		this.username = username;
		this.email = email;
	}
}