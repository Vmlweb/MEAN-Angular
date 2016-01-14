//Modules
import {provide} from "angular2/core";
import {it, describe, expect, inject, beforeEachProviders} from "angular2/testing";
import {HTTP_PROVIDERS, XHRBackend, Headers, RequestMethod, ResponseOptions, Response} from "angular2/http";
import {MockBackend, MockConnection} from "angular2/http/testing";

//Includes
import {TimeService} from "./time.service";

describe("Time", function(){

	//Create mock http backend
	beforeEachProviders(() => {
		return [
			HTTP_PROVIDERS,
			provide(XHRBackend, {useClass: MockBackend}),
			TimeService
		];
	});
	
	// !Positive Tests
	
	describe("Positive Tests", () => {
		
		it("should return stub time", inject([XHRBackend, TimeService], (mockBackend, timeService) => {
			
			//Prepare mock http response
			mockBackend.connections.subscribe((connection: MockConnection) => {
				
				//Check url and request was correct
				expect(connection.request.method).toBe(RequestMethod.Get);
				expect(connection.request.url).toBe("/api/v1/time");
				
				//Send mock response
				connection.mockRespond(new Response(new ResponseOptions({
					headers: new Headers({
						'Content-Type': 'application/json'
					}),
					body: {
						time: "Sunday, December 12th 2012, 12:12:12 am"
					}
				})));
			});
			
			//Check that time matches stub time
			timeService.current().subscribe(
				time => {
					expect(time).toBe("Sunday, December 12th 2012, 12:12:12 am");
				},
				err => {
					expect(err).not.toBeDefined();
				}
			);
			
		}));
		
	});
	
});