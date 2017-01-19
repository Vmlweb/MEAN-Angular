//Modules
import * as express from 'express'
import * as path from 'path'

//Includes
import { log, ErrorCode, ServerError, ClientError } from 'app'

//Create router
const router = express.Router()

//Import apis
import * as v1 from './v1'

//Mount apis
router.use('/v1', v1.router)

//Export apis
export { v1 }

//Add api not found middleware
router.use((req, res, next) => {
	res.status(404).json({
		error: ErrorCode.NotFound
	})
})

//Add exception handling middleware
router.use((err, req, res, next) => {
	if (err instanceof ClientError){
	
		//Client error found
		let error = (err as ClientError)
		res.status(200).json({
			error: ErrorCode[error.message]
		})

	}else if (err instanceof ServerError){
		
		//Server error found
		let error = (err as ServerError)
		res.status(500).json({
			error: ErrorCode.Server
		})
		log.error(error.stack)
		
	}else{
		
		//Other error found
		res.status(500).json({
			error: ErrorCode.Server
		})
		log.error(err.stack)
	}
})

log.info('Setup error handling middleware')

export { router }