//Modules
var mongoose = require("mongoose");

//Schema
var schema = new mongoose.Schema({
	username: String,
	email: String,
});

//Model
module.exports = mongoose.model("Users", schema);