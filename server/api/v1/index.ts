//Modules
import * as express from 'express'

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
Object.keys(epFiles).forEach((file) => {
	
	//Cast endpoint and add to list
	const endpoint = epFiles[file].endpoint as Endpoint
	endpoints.push(endpoint)
	
	//Check method and mount try catch wrapped promise to url on router
	switch(endpoint.method) {
		case Method.All: 
			router.all(endpoint.url, endpoint.promise())
			break
		case Method.Get: 
			router.get(endpoint.url, endpoint.promise())
			break
		case Method.Post:
			router.post(endpoint.url, endpoint.promise())
			break
		case Method.Put:
			router.put(endpoint.url, endpoint.promise())
			break
		case Method.Delete:
			router.delete(endpoint.url, endpoint.promise())
			break
		case Method.Patch:
			router.patch(endpoint.url, endpoint.promise())
			break
		case Method.Options:
			router.options(endpoint.url, endpoint.promise())
			break
		case Method.Head:
			router.head(endpoint.url, endpoint.promise())
			break
	}
})

export { router, endpoints }