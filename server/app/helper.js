var validator = require("validator");
var async = require("async");
var fs = require("fs");
var path = require("path");
var helper = {};

helper.loadCertificate = function(str){
	if (str !== "" && fs.existsSync(path.join(__certs, str))){
		return fs.readFileSync(path.join(__certs, str));
	}else{
		return this;
	}
};

helper.isString = function(str){
	if (str instanceof String || typeof str === "string"){
		return true;
	}else{
		return false;
	}
};

helper.loadParam = function(obj, prop, def){
	if (obj.hasOwnProperty(prop)){
		return obj[prop];
	}else{
		return def;
	}
};

helper.trim = function(str){
	return validator.trim(validator.stripLow(str));
};

helper.saveAll = function(arr, callback){
	async.each(arr, function (obj, done) {
		obj.save(function(err){
			if (err){
				done(err);
			}else{
				done();
			}
		});
	}, function(err){
		if (err){
			callback(err);
		}else{
			callback();
		}
	});
};

Array.prototype.last = function () {
	return this[this.length - 1];
};

module.exports = helper;