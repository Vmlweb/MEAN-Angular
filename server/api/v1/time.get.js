//Modules
var router = require("express").Router();
var moment = require("moment");

//Includes
var Time = require(__time);

router.get("/v1/time", (req, res, next) => {
	
	//Create new time object, set format and retrieve value
	var time = new Time();
	time.format = "dddd, MMMM Do YYYY, h:mm:ss a";
	var currentTime = time.getTime();
	
	//Send time response
	res.json({ time: currentTime });
});

module.exports = router;