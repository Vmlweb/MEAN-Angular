//Declarations
declare var jQuery:any;

//Modules
import {Component, ElementRef, AfterViewInit, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

//Includes
import {UserService} from '../../services/users.service';
import {User} from '../../services/user.model';

@Component({
	templateUrl: 'home/first/first.html',
	directives: [ROUTER_DIRECTIVES],
	providers: [UserService]
})

export class FirstComponent {
	
	elementRef: ElementRef;
	modalRef: any;
	
	users: User[];
	userService: UserService;
	userLimit = 500;
	
	constructor(elementRef: ElementRef, userService: UserService){
		this.elementRef = elementRef;
		this.userService = userService;
	}
	
	ngAfterViewInit(){
		this.modalRef = jQuery(this.elementRef.nativeElement).find('#modal_window');
		this.loadUsers();
	}
	
	//Load users from service
	loadUsers(){
		this.userService.getUsers(this.userLimit).subscribe(
			users => {
				this.users = users;
			},
			error => {
				alert(JSON.stringify(error));
			}
		);
	}
	
	//Insert new user to service
	insertUser(){
		this.userService.insertUser(prompt("Please enter username"), prompt("Please enter email")).subscribe(
			() => {
				this.loadUsers();
			},
			error => {
				alert(JSON.stringify(error));
			}
		);
	}
	
	//Remove user from service with identnfier
	removeUser(userId: string){
		this.userService.deleteUser(userId).subscribe(
			() => {
				this.loadUsers();
			},
			error => {
				alert(JSON.stringify(error));
			}
		);
	}
	
	//Triggered when user limit changed
	onLimitChanged(limit: string){
		
		//Check if new limit is valid
		let validLimit = parseInt(limit);
		if (!validLimit){
			this.userLimit = 500;
		}else{
			this.userLimit = validLimit;
		}
		this.loadUsers();
	}
	
	//Modal window toggle
	openModal(){
		this.modalRef.modal('show');
	}
	closeModal(){
		this.modalRef.modal('hide');
	}
	closeModalOk(){
		alert('Indeed!');
		this.closeModal();
	}
}