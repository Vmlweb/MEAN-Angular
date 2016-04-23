//Modules
const path = require("path");

//Directories
global.__api = path.join(__dirname, "api");
global.__api_v1 = path.join(__dirname, "api/v1");
global.__client = path.join(__dirname, "../client");
global.__models = path.join(__dirname, "models");
global.__app = path.join(__dirname, "app");
global.__certs = path.join(__dirname, "../certs");
global.__logs = path.join(__dirname, "../logs");

//Testing directories
if (process.env.NODE_ENV === "testing"){
	global.__certs = path.join(__dirname, "../../certs");
	global.__logs = path.join(__dirname, "../../logs");
}

//App Files
global.__config = path.join(__dirname, "../config.js");
global.__errors = path.join(__dirname, "app/errors.js");
global.__time = path.join(__dirname, "app/time.js");