//Dependancies
import {Component, View, ElementRef, AfterViewInit, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
declare var jQuery:any;

//Include
import {Users} from '../../services/users.service';
import {User} from '../../services/user.model';

//Configuration
@Component({
	templateUrl: 'home/first/first.html',
	directives: [ROUTER_DIRECTIVES],
	providers: [Users]
})

//Export
export class FirstComponent {
	
	//Properties
	elementRef: ElementRef;
	modalRef: any;
	
	//Data
	userService: Users;
	users: User[];
	limit = 500;
	
	//Constructor
	constructor(elementRef: ElementRef, userService: Users){
		this.elementRef = elementRef;
		this.userService = userService;
	}
	
	//Find jquery references
	ngAfterViewInit(){
		this.modalRef = jQuery(this.elementRef.nativeElement).find('#modal_window');
		this.reloadUsers();
	}
	
	//Insert new user
	insertUser(){
		
		//Get user details
		let username = prompt("Please enter username");
		let email = prompt("Please enter email");
		
		//Insert user
		this.userService.insertUser(username, email).subscribe(
			data => {
				
				//Check for errors
				if (data.hasOwnProperty('error')){
					alert(data.error);
				}else{
					this.reloadUsers();
				}
				
			},
			err => {
				alert(JSON.stringify(err));
			}
		);
	}
	
	//Remove user with id
	removeUser(userId: string){
		
		this.userService.deleteUser(userId).subscribe(
			data => {
				
				//Check for errors
				if (data.hasOwnProperty('error')){
					alert(data.error);
				}else{
					this.reloadUsers();
				}
				
			},
			err => {
				alert(JSON.stringify(err));
			}
		);
	}
	
	//Reload all users
	reloadUsers(){
		this.userService.getUsers(this.limit).subscribe(
			users => {
				this.users = users;
			},
			err => {
				alert(JSON.stringify(err));
			}
		);
	}
	
	//Reload list on limit change
	limitChanged(limit: string){
		
		//Check if limit is valid
		let validLimit = parseInt(limit);
		if (!validLimit){
			this.limit = 500;
		}else{
			this.limit = validLimit;
		}
		this.reloadUsers();
	}
	
	//Modal toggle
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