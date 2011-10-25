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
		$(document).ready(function() {
			window.APP.events.publish('app/ready');
		});
	});
});