export class ServerError extends Error {
	constructor(public message: string) {
		super(message)
		Object.setPrototypeOf(this, ServerError.prototype)
	}
}

export class ClientError extends Error {
	constructor(public code = ErrorCode.Unknown) {
		super(ErrorCode[code])
		Object.setPrototypeOf(this, ClientError.prototype)
	}
}

export enum ErrorCode{
	
	//Core
	Unknown = 1000,
	Server = 1001,
	NotFound = 1002,
	Connection = 1003,
	
	//Users
	UserMissing = 2000,
	UsernameMissing = 2001,
	EmailMissing = 2002
}