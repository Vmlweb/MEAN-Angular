const nodemon = require('nodemon')

//Start app with fast reload
const app = nodemon({ script: 'server/main.js' })

//Override nodemon exit handler as it doesnt always exit clean
process.removeAllListeners('SIGTERM')
process.on('SIGTERM', function(){

	//Quit nodemon app and exit main process
	nodemon.emit('quit')
	nodemon.on('exit', () => {
		process.exit()
	})
})
