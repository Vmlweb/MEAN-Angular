System.config({
 	baseURL: "/",
	packages: {
		app: {
			format: "register",
			defaultExtension: "js"
		},
		home: {
			format: "register",
			defaultExtension: "js"
		}
	}
});
System.import("app/bootstrap").then(null, console.error.bind(console));