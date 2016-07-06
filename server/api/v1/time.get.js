//Modules
const router = require('express').Router();
const moment = require('moment');

//Includes
const Time = require(__time);

router.get('/v1/time', function (req, res, next){	
	
	//Create new time object, set format and retrieve value
	let time = new Time();
	time.format = 'dddd, MMMM Do YYYY, h:mm:ss a';
	let currentTime = time.getTime();
	
	//Send time response
	res.json({ time: currentTime });
});

module.exports = router;