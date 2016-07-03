#!/bin/bash

if [ "$1" == "start" ]; then
	
	# Start app and database in Docker
	
	docker run --name @@NAME_db -d -v @@DATABASE_PATH:/data/db -v @@CERTS_PATH:/home/certs -p @@DATABASE_REPL_NODES_PORT:@@DATABASE_REPL_NODES_PORT mongo --auth --keyFile /home/certs/@@DATABASE_REPL_KEY --replSet @@DATABASE_REPL_NAME @@MONGO_CONFIG
	docker run --name @@NAME_app -d -v @@CERTS_PATH:/home/certs -v @@LOGS_PATH:/home/logs -v @@CONFIG:/home/config.js @@DOCKER_CONFIG -it @@NAME_app

elif [ "$1" == "stop" ]; then
	
	# Stop app and database in Docker
	
	docker stop @@NAME_app
	docker rm @@NAME_app
	docker stop @@NAME_db
	docker rm @@NAME_db

elif [ "$1" == "app" ]; then
	
	# Start app in docker
	
	docker run --name @@NAME_app -d -v @@CERTS_PATH:/home/certs -v @@LOGS_PATH:/home/logs -v @@CONFIG:/home/config.js @@DOCKER_CONFIG -it @@NAME_app
	
elif [ "$1" == "app_stop" ]; then
	
	# Stop app in Docker
	
	docker stop @@NAME_app
	docker rm @@NAME_app
	
elif [ "$1" == "db" ]; then
	
	#Start database in Docker
	
	docker run --name @@NAME_db -d -v @@DATABASE_PATH:/data/db -v @@CERTS_PATH:/home/certs -p @@DATABASE_REPL_NODES_PORT:@@DATABASE_REPL_NODES_PORT mongo --auth --keyFile /home/certs/@@DATABASE_REPL_KEY --replSet @@DATABASE_REPL_NAME @@MONGO_CONFIG
	
elif [ "$1" == "db_stop" ]; then
	
	# Stop database in Docker
	
	docker stop @@NAME_db
	docker rm @@NAME_db
	
elif [ "$1" == "reset" ]; then
	
	# Clean and reset database directory
	
	docker stop @@NAME_db
	docker rm @@NAME_db
	rm -r @@DATABASE_PATH
	docker run --name @@NAME_db -d -v @@DATABASE_PATH:/data/db -v @@CERTS_PATH:/home/certs -p @@DATABASE_REPL_NODES_PORT:@@DATABASE_REPL_NODES_PORT mongo --auth --keyFile /home/certs/@@DATABASE_REPL_KEY --replSet @@DATABASE_REPL_NAME
	sleep 1
	docker exec -i @@NAME_db mongo < ./mongodb.js
	sleep 0.5
	docker stop @@NAME_db
	docker rm @@NAME_db
	
elif [ "$1" == "clean" ]; then
	
	# Clean temporary Docker files and images
	
	docker stop $(docker ps -a -q)
	docker rm $(docker ps -a -q)
	docker rmi $(docker images -q)
	docker run -v /var/run/docker.sock:/var/run/docker.sock -v /var/lib/docker:/var/lib/docker --rm martin/docker-cleanup-volumes
	
else

	echo "Commands are start, stop, app, app_stop, db, db_stop, reset and clean"
	
fi