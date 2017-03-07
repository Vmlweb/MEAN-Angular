//Modules
import { Component, ElementRef, AfterViewInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
	selector: 'app',
	styles: ['./app.style.css'],
	template: './app.template.html'
})

export class AppComponent implements AfterViewInit {
	
	modal: any
	
	constructor(private element: ElementRef, private router: Router){}
	
	ngAfterViewInit(){
		this.modal = $(this.element.nativeElement).find('.ui.modal')
	}

	showModal(){
		this.modal.modal('show')
	}
}