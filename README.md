# MEAN Stack Template

Quick and simple template to get up and running with a MEAN stack web app inside of docker.

## Features

  * Docker & Compose
  * MongoDB & Mongoose
  * AngularJS 2 & Typescript
  * Semantic UI & jQuery
  * Jade & Stylus Templates
  * Jasmin & Karma Unit Tests
  * Winston File & Console Logs
  * Gulp 4 Workflow (Dev, Test & Dist)
  * PM2 (Multi-Core, Load Balancing)

## Prequisitions

First download the repository, then install NodeJS and Docker onto Ubuntu 15.10.

```bash
git clone https://github.com/Vmlweb/MEAN-AngularJS-2.git
cd mean

chmod +x server.sh
./server.sh install
```

Next install the gulp command line tools if you have not already.

```bash
sudo npm install -g gulpjs/gulp.git#4.0 bower karma tsd jasmine
```

## Installation

Then install the project dependancies and setup the development environment.

```bash
npm install
gulp setup
```

If prompted for input use the default location or setting. (Press Enter)

## Directory Structure

- `builds` - Temporary built/compiled files.
- `certs` - Client side website source.
- `client` - Client side website source.
- `client/tests` - Unit testing setup for client website.
- `client/typings` - Typescript library type mappings.
- `data` - Development database binary files.
- `dist` - Production ready distribution builds.
- `logs` - Development JSON log files.
- `semantic` - User interface framework source.
- `server` - Server side application source.
- `server/api` - API endpoints for server app.
- `server/app` - Core functions for server app.
- `server/models` - Database models and schemas for server app.
- `server/test` - Unit testing setup for server app.
- `server/typings` - Typescript library type mappings.

## File Structure

- `bower.json` - Client website package dependancies.
- `docker-compose.yml` - Layout for running distribution build with docker compose.
- `Dockerfile` - App docker definition for distribution build.
- `gulp.js` - Workflow and build tasks.
- `mongodb.js` - Executed in MongoDB on database setup.
- `karma.shim.js` - Middleware to help with AngularJS 2 unit tests.
- `package.json` - Server application package dependancies.
- `semantic.json` - User interface framework configuration.
- `server.sh` - Start or stop the production server.

## Development

For development the primary working directories are.

- `client` - Client side website source.
- `semantic` - User interface framework source.
- `server` - Server side application source.

You can start the development server which will rebuild any changes live.

```bash
gulp dev
```

Press `control + c` to stop and exit the development server.

Make sure the development server is stopped after you've finished working.

```bash
gulp stop
```

Use the following to reset the development server database and logs.

```bash
gulp reset
```

The development server stores its `data` and `logs` in the local directory.

## Logger

Use the following commands to log messages directly to the console and `logs` directory

```javascript
log.error('ERROR'); //Error log file
log.warn('WARN'); //Info log file
log.info('info'); //Info log file
log.verbose('verbose'); //Access log file
```

## Libraries

You can make changes to the user interface and themes in the `semantic` directory but must rebuild them to take affect.

```bash
gulp semantic
```

To add libraries to the client website first install them with bower.

```bash
bower install --save --allow-root jquery
```

Then add them to `gulpfile.js` under the `copy:build` task and they be copied to the `/libs/` directory upon build. 

Also make sure you add them to `karma.conf.js` under `files` if you need them to be included in client website testing.

## Testing

You can execute the automated unit tests either combined or individually for the server and client.

```bash
gulp test
gulp test:client
gulp test:server
```

Test files should be included in the `server` and `client` directories and use the following filenames.

```bash
*.mock.js
*.stub.js
*.test.js
*.spec.js
*.db.js
```

The `data` and `logs` directories are not exposed when testing and will be reset after each test run.

You can also add testing libraries for the client website using bower.

```bash
bower install --save-dev --allow-root angular-mocks
```

Then add them to `gulpfile.js` under the `copy:test` task and they be copied to the `/libs/` directory upon testing. 

Also make sure you add them to `karma.conf.js` under `files` so they are included when testing.

## Distribution

To compile and archive a production ready distribution build using the following commands.

```bash
gulp dist
gulp archive
```

These files will be generated in the `dist` directory.

- `mean_*.tar.gz` - Compressed version of all the files below.
- `docker-compose.yml` - Layout for running distribution build with docker compose.
- `mean_app.tar` - Docker image for distribution build.
- `mongodb.js` - Executed in MongoDB on database setup.
- `server.sh` - Start or stop the production server.

## Executing Locally

To setup and reset your production database use the following command

```bash
cd dist
./server.sh reset
```

Use the `server.sh` file to start and stop your production app within docker.

```bash
./server.sh start
./server.sh stop
```

## Executing Externally

When transferred to another host you will need to either pull or load the docker images again and setup the production database.

```bash
chmod +x server.sh

docker load < mean_app.tar
docker load < mean_db.tar

./server.sh reset
```

You can then use the same commands mentioned above to execute the production app.