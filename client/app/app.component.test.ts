import { AppComponent } from 'app/app.component'

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

describe('AppComponent (inline template)', () => {

  let comp:    AppComponent
  let fixture: ComponentFixture<AppComponent>
  let de:      DebugElement
  let el:      HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ], // declare the test component
    })

    fixture = TestBed.createComponent(AppComponent)

    comp = fixture.componentInstance // BannerComponent test instance

    // query for the title <h1> by CSS element selector
    de = fixture.debugElement.query(By.css('h1'))
    el = de.nativeElement
  })
  
  it('should display original title', () => {
	  fixture.detectChanges()
	  expect(el.textContent).toContain(comp.title)
	})
	
	it('should display a different test title', () => {
	  comp.title = 'Test Title'
	  fixture.detectChanges()
	  expect(el.textContent).toContain('Test Title')
	})
})

describe('1st tests', function(){
  it('asdfadsfsdf', function(done){
	  //setTimeout(function(){
		  
		  //var test = new AppComponent()
		  //expect(test.test()).toBe('test')
		  
		 
		  
		  done()
	  //}, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(false).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
	it('true is true', function(done){
	  setTimeout(function(){
		  expect(true).toBe(true)
		  done()
	  }, 1)
	})
})

console.log(1)