//Modules
import * as express from 'express'
import * as catcher from 'promise-catcher'

//Includes
import { Endpoint, Method } from 'app'

//Create router
const router = express.Router()

//Find all endpoint files
const epFiles = {}
const requireContext = require.context('./', true, /\.ep.ts$/)
requireContext.keys().forEach(key => epFiles[key] = requireContext(key))

//Loop through found endpoints
const endpoints: Endpoint[] = []
Object.keys(epFiles).forEach(file => {
	
	//Cast endpoint and add to list
	const endpoint = epFiles[file].endpoint as Endpoint
	endpoints.push(endpoint)
	
	//Check method and mount try catch wrapped promise to url on router
	switch(endpoint.method) {
		case Method.All: 
			router.all(endpoint.url, catcher.express(endpoint.execute))
			break
		case Method.Get: 
			router.get(endpoint.url, catcher.express(endpoint.execute))
			break
		case Method.Post:
			router.post(endpoint.url, catcher.express(endpoint.execute))
			break
		case Method.Put:
			router.put(endpoint.url, catcher.express(endpoint.execute))
			break
		case Method.Delete:
			router.delete(endpoint.url, catcher.express(endpoint.execute))
			break
		case Method.Patch:
			router.patch(endpoint.url, catcher.express(endpoint.execute))
			break
		case Method.Options:
			router.options(endpoint.url, catcher.express(endpoint.execute))
			break
		case Method.Head:
			router.head(endpoint.url, catcher.express(endpoint.execute))
			break
	}
})

export { router, endpoints }