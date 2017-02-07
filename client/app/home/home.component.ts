//Modules
import { wait } from 'promise-catcher'
import { Component } from '@angular/core'

//Includes
import { ErrorMessage } from 'shared'
import { IUserAction, User, UserService } from 'api'

@Component({
	styles: [require('../app.style.css')],
	template: require('./home.template.html')
})

export class HomeComponent {
	
	limit = ''
	removing = -1
	updating = -1
	creating = false
	
	users: User[] = []
	
	model: IUserAction = {
		username: '',
		email: ''
	}
	
	constructor(private userService: UserService){}
	
	ngAfterViewInit(){
		this.load()
	}
	
	async load(){
		
		//Load users
		try{
			this.users = await this.userService.list(+this.limit || undefined)
		}catch(err){
			alert(ErrorMessage[err])
		}
	}
	
	async insert(){
		this.creating = true
		
		//Insert user and wait
		try{
			await wait(500)
			await this.userService.insert(this.model)
		}catch(err){
			alert(ErrorMessage[err])
		}
		
		//Reload list of users
		await this.load()
		
		//Reset state
		this.creating = false
		this.model = {
			username: '',
			email: ''
		}
	}
	
	async update(user: User, username: string){
		
		//Update user in background
		try{
			await this.userService.update(user, { username, email: user.email })
		}catch(err){
			alert(ErrorMessage[err])
		}
		
		//Reset state
		this.updating = -1
	}
	
	async remove(user: User){
		
		//Ask user to confirm
		if (!confirm('Are you sure you would like to remove ' + user.username)){
			this.removing = -1
			return
		}
		
		//Remove user and wait
		try{
			await wait(500)
			await this.userService.remove(user)
		}catch(err){
			alert(ErrorMessage[err])
		}
		
		//Reload list of users
		await this.load()
		this.removing = -1
	}
}