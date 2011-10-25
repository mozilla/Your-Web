require([], function() {
	require([
		'libs/jquery-1.6.4.min',
		'core',
		'server',
        'hash',
		'ui',
		'tileViz',
		'browsertester'
	], 
	function(){
		// Bootstrap the app
		window.APP.events.publish('app/ready');
	});
});