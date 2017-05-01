//Modules
import * as express from 'express'

//Includes
import { ErrorCode } from 'shared'
import { log } from 'app'

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
	if (err.hasOwnProperty('error')){
		
		//Client error found
		res.status(200).json(err)
		
	}else if (typeof err === 'number'){
	
		//Client error found
		res.status(200).json({
			error: err
		})
		
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