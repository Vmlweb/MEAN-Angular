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
	
elif [ "$1" == "install" ]; then
	
	# Install NodeJS and Docker on Ubuntu 15.10
	
	sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
	sudo echo "deb https://apt.dockerproject.org/repo ubuntu-wily main" > /etc/apt/sources.list.d/docker.list
	sudo curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
	
	sudo apt-get -y update && apt-get -y upgrade
	sudo apt-get -y purge lxc-docker
	sudo apt-cache policy docker-engine
	sudo apt-get install -y nodejs linux-image-extra-$(uname -r) docker-engine libfontconfig libjpeg8
	sudo service docker start
	
	# Install Docker Compose on Ubuntu 15.10
	
	sudo curl -L https://github.com/docker/compose/releases/download/1.5.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
	
	# Install missing lib issue with Gulp 4 for Ubuntu 15.10
	
	wget http://security.ubuntu.com/ubuntu/pool/main/i/icu/libicu52_52.1-8ubuntu0.2_amd64.deb
	sudo dpkg -i libicu52_52.1-8ubuntu0.2_amd64.deb
	rm libicu52_52.1-8ubuntu0.2_amd64.deb
	
	# Install NPM dependancies for project
	
	npm install -g gulpjs/gulp.git#4.0 bower karma tsd jasmine
	npm install
	
elif [ "$1" == "clean" ]; then
	
	# Clean temporary Docker files and images
	
	docker stop $(docker ps -a -q)
	docker rm $(docker ps -a -q)
	docker rmi $(docker images -q)
	docker run -v /var/run/docker.sock:/var/run/docker.sock -v /var/lib/docker:/var/lib/docker --rm martin/docker-cleanup-volumes
	
else

	echo "Commands are reset, start, stop, install and clean"
	
fi