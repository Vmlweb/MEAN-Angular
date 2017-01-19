#!/bin/bash

if [ "$1" == "start" ]; then
	
	#Start database in Docker
	
	docker stop @@NAME_db
	docker rm @@NAME_db
	docker run --name @@NAME_db -d -v @@DATABASE_PATH:/data/db -v @@CERTS_PATH:/home/certs -p @@DATABASE_REPL_NODES_PORT:27017 mongo --auth --keyFile /home/certs/@@DATABASE_REPL_KEY --replSet @@DATABASE_REPL_NAME @@MONGO_CONFIG
	
elif [ "$1" == "stop" ]; then
	
	# Stop database in Docker
	
	docker stop @@NAME_db
	docker rm @@NAME_db
	
elif [ "$1" == "reset" ]; then
	
	# Clean and reset database directory
	
	docker stop @@NAME_db
	docker rm @@NAME_db
	rm -r @@DATABASE_PATH
	docker run --name @@NAME_db -d -v @@DATABASE_PATH:/data/db -v @@CERTS_PATH:/home/certs -p @@DATABASE_REPL_NODES_PORT:27017 mongo --auth --keyFile /home/certs/@@DATABASE_REPL_KEY --replSet @@DATABASE_REPL_NAME
	sleep 1
	docker exec -i @@NAME_db mongo < ./mongodb.js
	sleep 0.5
	docker stop @@NAME_db
	docker rm @@NAME_db
	
elif [ "$1" == "restart" ]; then
	
	# Stop database in Docker
	
	docker stop @@NAME_db
	docker rm @@NAME_db

	#Start database in Docker
	
	docker stop @@NAME_db
	docker rm @@NAME_db
	docker run --name @@NAME_db -d -v @@DATABASE_PATH:/data/db -v @@CERTS_PATH:/home/certs -p @@DATABASE_REPL_NODES_PORT:27017 mongo --auth --keyFile /home/certs/@@DATABASE_REPL_KEY --replSet @@DATABASE_REPL_NAME @@MONGO_CONFIG
	
else

	echo "Commands are start, stop, restart and reset"
	
fi