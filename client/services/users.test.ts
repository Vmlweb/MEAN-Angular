//Modules
import {provide} from "angular2/core";
import {it, describe, expect, inject, beforeEachProviders, afterEach} from "angular2/testing";
import {HTTP_PROVIDERS, XHRBackend, Headers, RequestMethod, ResponseOptions, Response} from "angular2/http";
import {MockBackend, MockConnection} from "angular2/http/testing";

//Includes
import {UserService} from "./users.service";

describe("User Service", function(){

	//Create mock http backend
	beforeEachProviders(() => {
		return [
			HTTP_PROVIDERS,
			provide(XHRBackend, {useClass: MockBackend}),
			UserService
		];
	});
	
	// !Positive Tests
	
	describe("Positive Tests", () => {
		
		it("should get list of users", inject([XHRBackend, UserService], (mockBackend, userService) => {
			
			//Prepare mock http response
			mockBackend.connections.subscribe((connection: MockConnection) => {
				
				//Check url and request was correct
				expect(connection.request.method).toBe(RequestMethod.Get);
				expect(connection.request.url).toBe("/api/v1/users?limit=4");
				
				//Send mock response
				connection.mockRespond(new Response(new ResponseOptions({
					headers: new Headers({
						"Content-Type": "application/json"
					}),
					body: {
						users: [
							{ userId: "5696d1ab1300d90100721891", username: "FirstUser", email: "FirstUser@FirstUser.com" },
							{ userId: "5696d1ab1300d90100721892", username: "SecondUser", email: "SecondUser@SecondUser.com" },
							{ userId: "5696d1ab1300d90100721893", username: "ThirdUser", email: "ThirdUser@ThirdUser.com" },
							{ userId: "5696d1ab1300d90100721894", username: "FourthUser", email: "FourthUser@FourthUser.com" }
						]
					}
				})));
			});
			
			//Check that returned users match stub
			userService.getUsers(4).subscribe(
				users => {
					
					//Check users size
					expect(users.length).toBe(4);
					
					//Check users details
					expect(users[0].userId).toBe("5696d1ab1300d90100721891");
					expect(users[0].username).toBe("FirstUser");
					expect(users[0].email).toBe("FirstUser@FirstUser.com");
					expect(users[1].userId).toBe("5696d1ab1300d90100721892");
					expect(users[1].username).toBe("SecondUser");
					expect(users[1].email).toBe("SecondUser@SecondUser.com");
					expect(users[2].userId).toBe("5696d1ab1300d90100721893");
					expect(users[2].username).toBe("ThirdUser");
					expect(users[2].email).toBe("ThirdUser@ThirdUser.com");
					expect(users[3].userId).toBe("5696d1ab1300d90100721894");
					expect(users[3].username).toBe("FourthUser");
					expect(users[3].email).toBe("FourthUser@FourthUser.com");
					
				},
				error => {
					expect(error).not.toBeDefined();
				}
			);
			
		}));
		
		it("should insert new user", inject([XHRBackend, UserService], (mockBackend, userService) => {
			
			//Prepare mock http response
			mockBackend.connections.subscribe((connection: MockConnection) => {
				
				//Parse JSON request
				let request = JSON.parse(connection.request.text().toString());
				
				//Check url and request was correct
				expect(connection.request.method).toBe(RequestMethod.Post);
				expect(connection.request.url).toBe("/api/v1/users");
				expect(request.username).toBe("MyUsername");
				expect(request.email).toBe("MyEmail@MyEmail.com");
				
				//Send mock response
				connection.mockRespond(new Response(new ResponseOptions({
					headers: new Headers({
						"Content-Type": "application/json"
					}),
					body: {}
				})));
			});
			
			//Check that returned users match stub
			userService.insertUser("MyUsername", "MyEmail@MyEmail.com").subscribe(
				() => {},
				error => {
					expect(error).not.toBeDefined();
				}
			);
		}));
		
		it("should delete user with identifier", inject([XHRBackend, UserService], (mockBackend, userService) => {
			
			//Prepare mock http response
			mockBackend.connections.subscribe((connection: MockConnection) => {
				
				//Check url and request was correct
				expect(connection.request.method).toBe(RequestMethod.Delete);
				expect(connection.request.url).toBe("/api/v1/users?userId=5696d1ab1300d90100721891");
				
				//Send mock response
				connection.mockRespond(new Response(new ResponseOptions({
					headers: new Headers({
						"Content-Type": "application/json"
					}),
					body: {}
				})));
			});
			
			//Check that returned users match stub
			userService.deleteUser("5696d1ab1300d90100721891").subscribe(
				() => {},
				error => {
					expect(error).not.toBeDefined();
				}
			);
			
		}));
		
	});
	
});