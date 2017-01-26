//Modules
import { Component, ElementRef, AfterViewInit } from '@angular/core'
import { Router } from '@angular/router'

import { UserService } from 'api/user.service'

@Component({
	selector: 'app',
	styles: [require('./app.style.css')],
	template: require('./app.template.html')
})

export class AppComponent implements AfterViewInit {
	
	modal: any
	
	title = 'test'
	
	constructor(private element: ElementRef, private router: Router, private service: UserService){}
	
	ngAfterViewInit(){
		this.modal = $(this.element.nativeElement).find('.ui.modal')
		
		this.test2()
		//this.test()
	}
	
	async test2(){
		try{
			//let thing = await this.service.insert('test', 'test@2test.com')
			//console.log(thing)
			
		}catch(err){
			console.log(err)
		}
	}
	
	async test(){
		let users = await this.service.list()
		console.log(users)
	}
	
	showModal(){
		this.modal.modal('show')
	}
}