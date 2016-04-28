# MEAN Stack Template

Quick and simple template to get up and running with a MEAN stack web app inside of Docker.

## Features

  * NodeJS 5.x
  * Docker & Compose
  * MongoDB & Mongoose
  * AngularJS 2 & Typescript
  * Semantic UI & jQuery
  * Jade & Stylus Templates
  * JS Minification & Obfuscation
  * Jasmin & Karma Unit Tests (Test Plans)
  * Winston File & Console Logs
  * Gulp 4 Workflow (Dev, Test & Dist)
  * PM2 (Multi-Core, Load Balancing)
  * Compatible with CI Tools (Bamboo)

## Prequisitions

First download the repository.

```bash
git clone https://github.com/Vmlweb/MEAN-AngularJS-2.git
cd MEAN-AngularJS-2
```

Server.sh provides a quick command to install NodeJS 5, Docker and Compose onto Ubuntu 15.10.

```bash
chmod +x server.sh
./server.sh install
```

Next install the Gulp 4, Bower, Karma, Typings and Jasmine command line tools if you have not already.

```bash
sudo npm install -g gulpjs/gulp.git#4.0 bower karma typings jasmine
```

## Installation

Then install the project dependancies and setup the development environment.

```bash
npm install
gulp setup
```

## Directory Structure

- `builds` - Temporary built and compiled files.
- `certs` - Security certificates and key files.
- `client` - Client side website source.
- `client/app` - Angular bootstrap and app component.
- `client/tests` - Unit testing setup.
- `client/typings` - Typescript library type mappings.
- `data` - Development database binary files.
- `dist` - Production ready distribution builds.
- `logs` - JSON console logs and test XML reports.
- `semantic` - User interface framework source.
- `server` - Server side application source.
- `server/api` - API endpoints.
- `server/app` - Core functions for server app.
- `server/models` - Database models and schemas.
- `server/test` - Unit testing setup.
- `server/typings` - Typescript library type mappings.

## File Structure

- `bower.json` - Client website package dependancies.
- `config.js` - Configurations for development and distribution.
- `docker-compose.yml` - Layout for running distribution build with Docker Compose.
- `Dockerfile` - App Docker definition for distribution build.
- `gulp.js` - Workflow and build tasks.
- `mongodb.js` - Executed in MongoDB on database setup.
- `karma.shim.js` - Middleware to help with Angular unit tests.
- `package.json` - Server application package dependancies.
- `semantic.json` - User interface framework configuration.
- `server.sh` - Start or stop the production server.

## Development

For development the primary working directories are.

- `client` - Client side website source.
- `semantic` - User interface framework source.
- `server` - Server side application source.

You can start the development server which will rebuild any source file changes live.

```bash
gulp dev
```

Press `control + c` to stop and exit the development server.

Use the following to reset the development server database and logs.

```bash
gulp reset
```

The development server stores its `data` and `logs` in the local directory.

For browser libraries add the paths to `config.js` and they will be included in builds and testing.

## Console Logging

Use the following commands to log messages directly to the console and `logs` directory

```javascript
log.error('ERROR'); //Error log file
log.warn('WARN'); //Info log file
log.info('info'); //Info log file
log.verbose('verbose'); //Access log file
```

## User Interface

You can make changes to the user interface and themes in the `semantic` directory but must rebuild them to take affect.

```bash
gulp semantic
```

## Unit Testing

You can execute the automated unit tests either combined or individually for the server and client.

```bash
gulp test
gulp client.test
gulp server.test
```

Test files should be included in the `server` and `client` directories and use the `.test.ts, .test.js or .test.json` extensions.

When testing a blank database will be used, see `server/tests/database.test.js` for populating it before each test.

Server side test plans can be created in `config.js` and can then be executed using the `test.my_plan` command.

## Documentation

You can generate a concatenated markdown file from all files with the `.md` extension in your api directory.

```bash
gulp docs
```

The documentation will be generated in the `builds/docs` directory.

You can specify custom sets of documentation files through `config.js` which can be generated using the `docs.my_plan` command.

## Distribution

To compile a production ready distribution build use the following command.

```bash
gulp dist
```

These main files will be generated in the `dist` directory.

- `docker-compose.yml` - Layout for running distribution build with Docker Compose.
- `mean_app.tar` - App Docker image for distribution build.
- `mongodb.js` - Executed in MongoDB on database setup.
- `server.sh` - Start or stop the production server.

## Production

First import the Docker image onto the host machine.

```bash
docker load < mean_app.tar
```

You must then copy `config.js` and the `certs` directory to their respective locations specified in `config.js`.

Make sure to set the correct file permissions for these certificates.

```bash
chown -R 999:999 /opt/mean/certs
```

Then setup and wipe your production database using the following command.

```bash
./server.sh reset
```

Use can then use `server.sh` or `docker-compose.yml` to start and stop your production app using Docker.

```bash
./server.sh start
./server.sh stop

docker-compose up
```

You can start the app or database individually using the following commands.

```bash
./server.sh app
./server.sh db

./server.sh app_stop
./server.sh db_stop
```
