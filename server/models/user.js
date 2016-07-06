//Modules
const mongoose = require('mongoose');

//Schema
let schema = new mongoose.Schema({
	username: String,
	email: String,
});

//Model
module.exports = mongoose.model('Users', schema);