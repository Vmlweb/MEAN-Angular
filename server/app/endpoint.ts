//Modules
import * as express from 'express-serve-static-core'

//! Methods

export enum Method {
	All, Get, Post, Put, Delete, Patch, Options, Head
}

//! Request Interfaces

export interface IRequest extends express.Request {
	//...
}

export interface IHandler {
	(req: IRequest, res: express.Response, next: express.NextFunction): any
}

//! Endpoint Interfaces

export interface IEndpoint {
	
	url: express.PathParams
	method: Method
	execute: IHandler | IHandler[]
	
	title?: string
	description?: string
	errors?: Object
	
	parameters?: {
		headers?: string | Object
		request?: string | Object
		response?: string | Object
	}
	example?: {
		request?: string | Object
		response?: string | Object
	}
}

export class Endpoint {
	
	url: express.PathParams
	method: Method
	execute: IHandler | IHandler[]
	
	title: string | undefined
	description: string | undefined
	errors: Object | undefined
	
	parameters: {
		headers: string | Object | undefined
		request: string | Object | undefined
		response: string | Object | undefined
	}
	example: {
		request: string | Object | undefined
		response: string | Object | undefined
	}
	
	constructor(options: IEndpoint){
		
		this.url = options.url
		this.method = options.method
		this.execute = options.execute
		
		this.title = options.title || undefined
		this.description = options.description || undefined
		this.errors = options.errors || undefined
		
		this.parameters = {
			headers: options.parameters ? options.parameters.headers || undefined : undefined,
			request: options.parameters ? options.parameters.request || undefined : undefined,
			response: options.parameters ? options.parameters.response || undefined : undefined
		}
		
		this.example = {
			request: options.example ? options.example.request || undefined : undefined,
			response: options.example ? options.example.response || undefined : undefined
		}
	}
}