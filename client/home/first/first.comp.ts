//Dependancies
import {Component, View, ElementRef, AfterViewInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
declare var jQuery:any;

//Configuration
@Component({
	templateUrl: 'home/first/first.html',
	directives: [ROUTER_DIRECTIVES]
})

//Export
export class FirstComponent {
	
	//Properties
	elementRef: ElementRef;
	modalRef: any;
	
	//Constructor
	constructor(elementRef: ElementRef){
		this.elementRef = elementRef;
	}
	
	//Find jquery references
	ngAfterViewInit(){
		this.modalRef = jQuery(this.elementRef.nativeElement).find('#modal_window');
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