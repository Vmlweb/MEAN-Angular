//Modules
var async = require('async');
var path = require('path');

//Includes
var mongo = require(__app + '/mongo.js');

//Setup data
let data = [
	{ name: 'users', model: require(__models + '/user.js'), data: require(path.join(__dirname, '/users.test.json')) }
];

//Mark a table index as pending reset
var markModified = function(i, next){
	if (modified.indexOf(i) < 0){
		modified.push(i);
	}
	if (next){
		next();
	}
}

//Mark all tables as modified to populate first execution
let modified = [];
for (let i in data){
	markModified(i);
}

//Add schema hooks to detect database changes
for (let i in data){
	data[i].model.schema.pre('save', function(next){ markModified(i, next); });
	data[i].model.schema.pre('remove', function(next){ markModified(i, next); });
	data[i].model.schema.pre('update', function(next){ markModified(i, next); });
}

//Global hook to mark table or model as pending reset, use this when doing batch operations in unit tests
global.reset = function(name){
	for (let i in data){
		if (data[i].name === name || data[i].model === name){
			markModified(i);
		}
	}
}

beforeEach(function(callback){
	async.each(modified, function (i, done){
		
	    //Repopulate table for each modified item
	    console.log('Repopulating collection ' + data[i].name);
	    mongo.connection.db.dropCollection(data[i].name, function(err, result){
			data[i].model.insertMany(data[i].data, function(err){
				done(err);
			});
		});
			
    }, function(err){
	    modified = [];
	    callback(err);
    });
});