#!/bin/bash

if [ "$1" == "start" ]; then
	
	# Start app in docker
	
	docker stop @@NAME
	docker rm @@NAME
	docker run --name @@NAME -d --restart always -v @@CERTS_PATH:/data/certs -v @@LOGS_PATH:/data/logs -v @@CONFIG:/data/config.js @@DOCKER_CONFIG -it @@NAME
	
elif [ "$1" == "stop" ]; then
	
	# Stop app in Docker
	
	docker stop @@NAME
	docker rm @@NAME
	
elif [ "$1" == "restart" ]; then
	
	# Stop app in Docker
	
	docker stop @@NAME
	docker rm @@NAME
	
	# Start app in docker
	
	docker stop @@NAME
	docker rm @@NAME
	docker run --name @@NAME -d --restart always -v @@CERTS_PATH:/data/certs -v @@LOGS_PATH:/data/logs -v @@CONFIG:/data/config.js @@DOCKER_CONFIG -it @@NAME
	
else

	echo "Commands are start, stop and restart"
	
fi