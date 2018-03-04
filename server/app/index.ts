//Modules
export * from './app'
export * from './winston'
export * from './mongo'
export * from './express'
export * from './endpoint'

//Logger
let log
const setLogger = logger => {
	log = logger
}
export { log, setLogger }
