//Modules
import * as express from 'express-serve-static-core'

export enum Method{
	All, Get, Post, Put, Delete, Patch, Options, Head
}

export interface IEndpoint{
	
	url: express.PathParams
	method: Method
	execute: express.RequestHandler | express.RequestHandler[]
	
	title?: string
	description?: string
	errors?: Object
	
	parameters?: {
		request?: string | Object
		response?: string | Object
	}
	example?: {
		request?: string | Object
		response?: string | Object
	}
}

export class Endpoint{
	
	url: express.PathParams
	method: Method
	execute: express.RequestHandler | express.RequestHandler[]
	
	promise(){
		
		//Check whether execution is single or multi part
		if (this.execute instanceof Array){
			
			//Return array of try catch wrapped async executors
			const items = []
			for (const item of this.execute){
				items.push(async (req, res, next) => {
					try{
						await item(req, res, next)
					}catch(err){
						next(err)
					}
				})
			}
			return items
			
		}else{
			
			//Return single try catch wrapped async executor
			return async (req, res, next) => {
				try{
					await (this.execute as express.RequestHandler)(req, res, next)
				}catch(err){
					next(err)
				}
			}
		}
	}
	
	title: string | undefined
	description: string | undefined
	errors: Object | undefined
	
	parameters: {
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
			request: options.parameters ? options.parameters.request || undefined : undefined,
			response: options.parameters ? options.parameters.response || undefined : undefined
		}
		
		this.example = {
			request: options.example ? options.example.request || undefined : undefined,
			response: options.example ? options.example.response || undefined : undefined
		}
	}
}