export enum ErrorCode{
	
	//Core
	Unknown = 'Unknown',
	Server = 'Server',
	NotFound = 'NotFound',
	Connection = 'Connection',
	
	//Users
	USR_Invalid = 'USR_Invalid',
	USR_NotFound = 'USR_NotFound',
	USR_Disabled = 'USR_Disabled',
	
	USR_InvalidLogin = 'USR_InvalidLogin',
	USR_InvalidUsername = 'USR_InvalidUsername',
	USR_InvalidEmail = 'USR_InvalidEmail',
	USR_InvalidPassword = 'USR_InvalidPassword',
	USR_InvalidLimit = 'USR_InvalidLimit'
}

export const ErrorMessage: string[] = []

//Core
ErrorMessage[ErrorCode.Unknown] = 'An unknown error occured'
ErrorMessage[ErrorCode.Server] = 'Server error occured, please contact administrator'
ErrorMessage[ErrorCode.NotFound] = 'Page could not be found'
ErrorMessage[ErrorCode.Connection] = 'Could not find server, please check your internet connection'

//Users
ErrorMessage[ErrorCode.USR_Invalid] = 'User identifier was not given or invalid'
ErrorMessage[ErrorCode.USR_NotFound] = 'User account could not be found'
ErrorMessage[ErrorCode.USR_Disabled] = 'User account has been disabled, please contact administrator'

ErrorMessage[ErrorCode.USR_InvalidLogin] = 'User login was not given or invalid'
ErrorMessage[ErrorCode.USR_InvalidUsername] = 'Username was not given or invalid'
ErrorMessage[ErrorCode.USR_InvalidEmail] = 'E-mail address was not given or invalid'
ErrorMessage[ErrorCode.USR_InvalidPassword] = 'Password was not given or invalid'
ErrorMessage[ErrorCode.USR_InvalidLimit] = 'Limit was not given or invalid'