System.config({
	bundles: { 'app.js': ['app/bootstrap'] }
});

System.import('app/bootstrap').catch(console.error.bind(console));