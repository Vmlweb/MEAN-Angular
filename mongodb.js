//Setup replica set with configuration
rs.initiate({
	"_id": "@@DATABASE_REPL_NAME",
	"version": 1,
	"members": [{
		"_id": 1,
		"host": "@@DATABASE_REPL_NODES_HOSTNAME:@@DATABASE_REPL_NODES_PORT" 
	}]
});

//Wait for replica set to finish instantiating
while (rs.status().startupStatus || (rs.status().hasOwnProperty("myState") && rs.status().myState != 1)){
	sleep(1000);
};

//Create administrator account
use admin;
db.createUser({
    user: "admin",
    pwd: "@@DATABASE_ADMIN_PASSWORD",
    roles: [
	    { role: "root", db: "admin" }
	]
});
db.auth("admin", "@@DATABASE_ADMIN_PASSWORD");

//Create mean user account
use @@DATABASE_AUTH_DATABASE;
db.createUser({
    user: "@@DATABASE_AUTH_USERNAME",
    pwd: "@@DATABASE_AUTH_PASSWORD",
    roles: [
	    { role: "readWrite", db: "@@DATABASE_AUTH_DATABASE" }
	]
});
db.auth("@@DATABASE_AUTH_USERNAME", "@@DATABASE_AUTH_PASSWORD");