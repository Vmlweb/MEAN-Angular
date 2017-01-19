# MEAN Stack Template

[![Build Status](http://bamboo.vmlweb.co.uk:8085/plugins/servlet/wittified/build-status/OPEN-MEAN2)](http://bamboo.vmlweb.co.uk:8085/browse/OPEN-MEAN2)

Quick and simple template to get up and running with a MEAN stack web app inside of Docker.

## Features

  * NodeJS 6.x
  * Docker & Compose
  * MongoDB & Mongoose
  * Browserify & Babel
  * EmberJS 2 & Typescript
  * Semantic UI & jQuery
  * JS Minification & Obfuscation
  * Jasmin & Karma Unit Tests (Test Plans)
  * Istanbul Code Coverage (HTML & Clover)
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

Next install the Gulp 4, Bower and Typings command line tools if you have not already.

```bash
sudo npm install -g gulpjs/gulp.git#4.0 bower
```

## Installation

Then install the project dependancies and setup the development environment.

```bash
npm install
gulp setup
```

Some non-root environments may require modified file permissions for the certificates.

```
chown -R 999:999 certs
```

## Directory Structure

- `build` - Temporary builds and compiled files.
- `certs` - Security certificates and key files.
- `client` - Client side website source.
- `client/app` - Angular bootstrap and app component.
- `client/tests` - Unit testing setup.
- `client/typings` - Typescript library type mappings.
- `data` - Development database binary files.
- `dist` - Production ready distribution builds.
- `logs` - Console logs, coverage and test reports.
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
- `tsconfig.json` - Typescript compilation settings.

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
gulp client.test
gulp server.test
```

Test files should be included in the `server` and `client` directories and use the `.test.ts, .test.js or .test.json` extensions.

Server side test plans can be created in `config.js` and can then be executed using the `my_plan.test` command.

Testing and coverage reports will be generated in the `logs` directory.

## Testing Database

When testing a blank database will be used, see `server/tests/database.test.js` for populating it before each test.

When running client or external unit tests you can repopulate the database with test data using a http endpoint.

```
DELETE /reset
```

You can also start the database in standalone mock test data mode to run tests cases externally.

```
gulp mock
```

## Documentation

You can generate a concatenated markdown file from all files with the `.md` extension in your api directory.

```bash
gulp docs
```

The documentation will be generated in the `builds/docs` directory.

You can specify custom sets of documentation files through `config.js` which can be generated using the `my_plan.docs` command.

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
./database.sh reset
```

Use can then use `server.sh` or `docker-compose.yml` to start and stop your production app using Docker.

```bash
./server.sh start
./server.sh stop

./database.sh start
./database.sh stop

docker-compose up
```