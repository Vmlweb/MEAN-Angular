//Modules
import { Component, ElementRef, AfterViewInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
	selector: 'app',
	styles: [require('./app.style.css')],
	template: require('./app.template.html')
})

export class AppComponent implements AfterViewInit {
	
	modal: any
	
	title = 'test'
	
	constructor(private element: ElementRef, private router: Router){}
	
	ngAfterViewInit(){
		this.modal = $(this.element.nativeElement).find('.ui.modal')
	}
	
	showModal(){
		this.modal.modal('show')
	}
}