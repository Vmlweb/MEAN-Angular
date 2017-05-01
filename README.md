# MEAN Stack Template

[![Build Status](http://bamboo.vmlweb.co.uk:8085/plugins/servlet/wittified/build-status/OPEN-MEAN)](http://bamboo.vmlweb.co.uk/browse/OPEN-MEAN)

Quick and simple template to get up and running with a productive MEAN stack web app inside of Docker.

## Technologies

  * [NodeJS 7.x](https://nodejs.org) on Linux, Mac or Windows
  * [Docker](https://docker.com) & [Compose](https://docs.docker.com/compose)
<<<<<<< HEAD
  * [Typescript 2](https://www.typescriptlang.org)
=======
  * [Angular 4](https://angular.io) & [Typescript 2](https://www.typescriptlang.org)
>>>>>>> master
  * [Gulp 4](http://gulpjs.com) & [Webpack 2](https://webpack.js.org)
  * [Jasmine](https://jasmine.github.io), [Karma](http://karma-runner.github.io) & [Istanbul](http://gotwarlost.github.io/istanbul)
  * [Winston](https://github.com/winstonjs/winston) & [PM2](http://pm2.keymetrics.io)
  
## Features

  * Dev, Test & Dist Modes
  * Linting & Type Checking
  * Minification & Obfuscation
  * Test Plans & Test Data Reset
  * Coverage & Test Reporting
  * Multi-Core & Load Balancing
  * Compatible with CI Tools

## Prequisitions

First make sure you have the following dependancies installed on your machine.

- `NodeJS` - Available for [All Platforms](https://nodejs.org/en/).
- `Docker` - Available for [Linux](https://docs.docker.com/engine/installation/linux/), [Mac](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/).

Then install the Gulp 4 command line tools if you have not already.

```bash
npm install -g gulpjs/gulp.git#4.0
```

Next clone the repository from GitHub.

```bash
git clone https://github.com/Vmlweb/MEAN-Angular.git
cd MEAN-Angular
```

## Installation

First add your local IP address to `config.js` under `database.repl.nodes.hostname` for the database.

Then install the project dependancies and setup the development environment.

```bash
npm install
gulp setup
```

Make sure to set a unique project name in `config.js` as it will stop docker containers from clashing.

## Directory Structure

- `builds` - Temporary development build files.
- `certs` - SSL certificate and key files.
- `data` - Development database binary files.
- `dist` - Production ready distribution builds.
- `logs` - Access, info and error log files.
<<<<<<< HEAD
- `logs/tests/server` - Coverage and testing reports.
- `logs/tests/server/html` - Coverage html report.
=======
- `logs/tests/server|client` - Coverage and testing reports.
- `logs/tests/server|client/html` - Coverage html report.
- `logs/tests/merged` - Merged coverage reports.
- `logs/tests/merged/html` - Merged coverage html report.
- `semantic` - User interface customisations.
>>>>>>> master
- `server` - Server side application source.
- `server/api` - REST API endpoints.
- `server/app` - Core functions for server app.
- `server/models` - Database models and schemas.
- `server/tests` - Test data management.
- `shared` - Shared modules used by server.

## File Structure

- `config.js` - Configurations for development, testing and distribution.
- `database.js` - Start, stop and restart the production database container.
- `docker-compose.yml` - Docker compose definition for the production server.
- `Dockerfile` - Docker image definition for the distribution build.
- `mongodb.js` - Executed to configure database settings.
- `package.json` - Server based package dependancies.
- `server/main.ts` - Entry point for development and distribution builds.
- `server/test.ts` - Entry point for testing builds.
- `server/tests/collections.ts` - List of database collections, models and test data.
- `server.sh` - Start, stop and restart the production app container.
- `tsconfig.json` - Typescript compilation options.
- `tslint.json` - Linting rules and options.

## Development

For development the primary working directories are.

<<<<<<< HEAD
=======
- `client` - Client side website source.
- `semantic` - User interface customisations.
>>>>>>> master
- `server` - Server side application source.
- `shared` - Shared module source files.

You can start the development server which will rebuild any source file changes live.

```bash
gulp
```

Then access your website on `http://127.0.0.1:58000` or `https://127.0.0.1:58001`.

Use `control + c` to stop and exit the development server.

Use the following to reset the development server database.

```bash
gulp reset
```

The development server stores its logs in the local directory.

## Logging

Use the following commands to log messages directly to the console and `logs` directory.

```javascript
log.error('ERROR'); //Error log file
log.warn('WARN'); //Info log file
log.info('info'); //Info log file
log.verbose('verbose'); //Access log file
```

Logs will automatically be sorted by severity and bundled into date files.

<<<<<<< HEAD
=======
## Theming

You can make customisations to the site theme in the `semantic` directory.

The development environment can be started in theme mode which will rebuild changes live.

```
gulp theme
```

Please see the [Semantic UI](http://semantic-ui.com/usage/theming.html) theme guide for more information on this.

## Client Libraries

Adding client libraries into `libs.ts` will included them in your libs bundle.

Themes and libraries are cached so if changes are made to `libs.ts`, `vendor.ts` or the `semantic` directory you must clean the cache.

```
gulp clean
```

For traditional `index.html` style libraries or assets, add a glob expression to `config.js` under `libs` and they will be copied into the `/libs` directory.

>>>>>>> master
## Testing

Test files should be included in the `server` directory and use either `.test.ts` or `.test.js` extensions. 

They can be executed using the following command.

```bash
gulp test
```

You can also execute them in watch mode which will rebuild and test any source file changes live.

```bash
gulp server
```

Testing and coverage reports will be generated in the `logs/tests` directory.

## Test Plans

You can create test plans in `config.js` which will only execute tests in a specified directory.

```
gulp server.v1.test
```

These can also be executed in watch mode.

## Test Data

When testing, the server database will be reset before each test with the data found in `server/tests` JSON files.

You can add additional collections by specifying them in `server/collections.ts` with the model to use.

## Mock Server

When testing external applications you can run the server in mock mode which allows you to use test data.

```
gulp mock
```

You can use the following endpoint in mock mode to reset the test data in the server database.

```
DELETE /api
```

When running in mock mode please note that internal http and https ports are used.

## Distribution

To compile a production ready distribution build use the following command.

```bash
gulp dist
```

These files will be generated into the `dist` directory.

- `*.zip` - Docker image for distribution build.
- `database.js` - Start, stop and restart the production database container.
- `docker-compose.yml` - Docker compose definition for the production server.
- `mongodb.js` - Executed to configure database settings.
- `server.sh` - Start, stop and restart the production app container.

## Production

First import the Docker image onto the host machine.

```bash
unzip mean.zip
docker load < mean.tar
```

You must then copy `config.js` and the `certs` directory to their respective locations specified in `config.js`.

When using Linux make sure to set the correct file permissions for the certificates.

```bash
chown -R 999:999 /opt/mean/certs
```

Then wipe and configure your production database using `database.sh`.

```bash
chmod +x database.sh
./database.sh reset
```

When updating to a new build simply load in the new Docker image and restart the server. 

## Process

Use can then use `server.sh` or `docker-compose.yml` to start, stop and restart your production server.

```bash
cmod +x server.sh
cmod +x database.sh

./server.sh start
./server.sh stop

./database.sh start
./database.sh stop

docker-compose up
docker-compose down
```
