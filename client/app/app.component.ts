//Modules
import { Component, ElementRef, AfterViewInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
	selector: 'app',
	stylesUrl: ['./app.style.css'],//[require('./app.style.css')],
	templateUrl: './app.template.html'
	//require('./app.template.html')
})

export class AppComponent implements AfterViewInit {
	
	modal: any
	
	constructor(private element: ElementRef, public router: Router){}
	
	ngAfterViewInit(){
		this.modal = $(this.element.nativeElement).find('.ui.modal')
	}

	showModal(){
		this.modal.modal('show')
	}
}