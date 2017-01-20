//Modules
import * as express from 'express'
import * as path from 'path'

//Includes
import { Endpoint, Method } from 'app'

//Create router
const router = express.Router()

//Find all endpoint files
let epFiles = {};
let requireContext = require.context('./', true, /\.ep.ts$/)
requireContext.keys().forEach(key => epFiles[key] = requireContext(key))

//Loop through found endpoints
let endpoints: Endpoint[] = []
for (let file in epFiles){
	
	//Cast endpoint and add to list
	let endpoint: Endpoint = epFiles[file].default
	endpoints.push(endpoint)
	
	//Check method and mount try catch wrapped promise to url on router
	switch(endpoint.method) {
		case Method.All: router.all(endpoint.url, endpoint.promise()); break
		case Method.Get: router.get(endpoint.url, endpoint.promise()); break
		case Method.Post: router.post(endpoint.url, endpoint.promise()); break
		case Method.Put: router.put(endpoint.url, endpoint.promise()); break
		case Method.Delete: router.delete(endpoint.url, endpoint.promise()); break
		case Method.Patch: router.patch(endpoint.url, endpoint.promise()); break
		case Method.Options: router.options(endpoint.url, endpoint.promise()); break
		case Method.Head: router.head(endpoint.url, endpoint.promise()); break
	}
}

export { router, endpoints }