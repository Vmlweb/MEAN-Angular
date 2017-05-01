# MEAN Stack Template

[![Build Status](http://bamboo.vmlweb.co.uk:8085/plugins/servlet/wittified/build-status/OPEN-MEAN)](http://bamboo.vmlweb.co.uk/browse/OPEN-MEAN)

Quick and simple template to get up and running with a productive MEAN stack web app inside of Docker.

## Technologies

  * [NodeJS 7.x](https://nodejs.org) on Linux, Mac or Windows
  * [Docker](https://docker.com) & [Compose](https://docs.docker.com/compose)
  * [Typescript 2](https://www.typescriptlang.org)
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

Then install the Gulp 4 and Bower command line tools if you have not already.

```bash
npm install -g gulpjs/gulp.git#4.0
```

Next clone the repository from GitHub.

```bash
git clone https://github.com/Vmlweb/MEAN-Angular.git
cd MEAN-Angular
```

## Installation

Then install the project dependancies and setup the development environment.

```bash
npm install
gulp setup
```

Make sure to set a unique project name in `config.js` as it will stop docker containers from clashing.

## Directory Structure

- `builds` - Temporary development build files.
- `certs` - SSL certificate and key files.
- `dist` - Production ready distribution builds.
- `logs` - Access, info and error log files.
- `logs/tests/server` - Coverage and testing reports.
- `logs/tests/server/html` - Coverage html report.
- `logs/tests/merged` - Merged coverage reports.
- `logs/tests/merged/html` - Merged coverage html report.
- `server` - Server side application source.
- `server/api` - REST API endpoints.
- `server/app` - Core functions for server app.
- `shared` - Modules used by server.

## File Structure

- `config.js` - Configurations for development, testing and distribution.
- `docker-compose.yml` - Docker compose definition for the production server.
- `Dockerfile` - Docker image definition for the distribution build.
- `package.json` - Server based package dependancies.
- `server/main.ts` - Entry point for development and distribution builds.
- `server/test.ts` - Entry point for testing builds.
- `server.sh` - Start, stop and restart the production app container.
- `tsconfig.json` - Typescript compilation options.
- `tslint.json` - Linting rules and options.

## Development

For development the primary working directories are.

- `server` - Server side application source.
- `shared` - Modules used by server.

You can start the development server which will rebuild any source file changes live.

```bash
gulp
```

Then access your website on `http://127.0.0.1:58000` or `https://127.0.0.1:58001`.

Use `control + c` to stop and exit the development server.

The development server stores its logs in the local directory.

To add non-standard browser libraries add the paths to `config.js` and they will be included in builds and testing.

## Logging

Use the following commands to log messages directly to the console and `logs` directory.

```javascript
log.error('ERROR'); //Error log file
log.warn('WARN'); //Info log file
log.info('info'); //Info log file
log.verbose('verbose'); //Access log file
```

Logs will automatically be sorted by severity and bundled into date files.

## Testing

Test files should be included in the `server` directory and use either `.test.ts` or `.test.js` extensions.

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

## Mock Server

When testing external applications you can run the server in mock mode which allows you to use test data.

```
gulp mock
```

When running in mock mode please note that internal http and https ports are used.

## Distribution

To compile a production ready distribution build use the following command.

```bash
gulp dist
```

These files will be generated into the `dist` directory.

- `*.zip` - Docker image for distribution build.
- `docker-compose.yml` - Docker compose definition for the production server.
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

When updating to a new build simply load in the new Docker image and restart the server. 

## Process

Use can then use `server.sh` or `docker-compose.yml` to start, stop and restart your production server.

```bash
cmod +x server.sh

./server.sh start
./server.sh stop

docker-compose up
docker-compose down
```
