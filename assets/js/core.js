/**
 * The Core module defines several utilities the application
 * depends on, such as the events pubsub system.
 *
 * @module Core
 * @namespace APP
 * @class core
 */
 define(
//Module dependencies
[
	'libs/underscore.min'
],
function() {
	window.APP = (window.APP != undefined) ? window.APP : {};
	var app = window.APP,
		config = window.APP_CONFIG || {};
	
	// make it safe to use console.log always
	(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
	{console.log();return window.console;}catch(err){return window.console={};}})());
	
	
	// Extend App to include some cool core functionality and App config object
	_.extend(app, {
		
		config: config,
		
		/**
		 * A lightweight wrapper for console.log
		 * paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
		 *
		 * Usage: app.log('inside coolFunc', this, arguments)
		 *
		 * @submodule Utils
		 * @method log
		 */
		log: function(){
			var instance = this;
			
			instance.history = instance.history || [];   // store logs to an array for reference
		  	instance.history.push(arguments);
		  	
		  	if (window.console) {
				arguments.callee = arguments.callee.caller;
				var newarr = [].slice.call(arguments);
				(typeof console.log === 'object' ? instance.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
		  	}
		},
		
		/**
		 * A utility that non-destructively defines namespaces
		 *
		 * @submodule Utils
		 * @method namespace
		 * @param {String} namespaceString Name of namespace to create
		 * @return {Object} Namespaced object
		 */
		namespace: function(namespaceString) {
			var parts = namespaceString.split('.'),
				parent = app,
				i;
		
			// Strip redundant leading global
			if (parts[0] === 'APP') {
				parts = parts.slice(1);
			}
		
			for (i = 0, len = parts.length; i < len; i+=1) {
				// Create a property if it doesn't exist
				if (typeof parent[parts[i]] === 'undefined') {
					parent[parts[i]] = {};
				}
				parent = parent[parts[i]];
			}
		
			return parent;			
		},
    	
    	events: (function(){
    		// the topic/subscription hash
        	var _cache = {},
        		_topics = {},
        		_noSubsTopics = {},
        		_that = this,

            /**
             * Publish data on a named topic
             * 
             * Example:
             * App.events.publish("/some/topic", ["a","b","c"]);
             *
             * @submodule Events
             * @method publish
             * @param {String} topic The channel to publish on
             * @param {Array}  args  The data to publish. Each array item is converted into an ordered
     		 *		                 arguments on the subscribed functions.
     		 *
             */
        	publish = function(topic, args){
        		args = args || [];
        		_cache[topic] && _.each(_cache[topic], function(callback){
        			callback.apply(_that, args);
        		});
        		
        		//If there's no subscribers yet, cache it so we can send it to the first function that subscribes
        		if (!_cache[topic]) {
        			_noSubsTopics[topic] = args;
        		}
        	},

            /**
             * Register a callback on a named topic
             *
             * Example:
             * App.events.subscribe("/some/topic", function(a, b, c){ //handle data});
             *
             * @submodule Events
             * @method subscribe
             * @param {String}   topic     The channel to subscribe to
             * @param {Function} callback  The handler event. Anytime something is Sushi.events.publish'ed on a 
     		 *		                       subscribed channel, the callback will be called with the
     		 *		                       published array as ordered arguments.
     		 * 
     		 * @return {Array} A handle which can be used to unsubscribe this particular subscription
             */
        	subscribe = function(topic, callback){
         		if(!_cache[topic]){
        			_cache[topic] = [];
        		}
        		_cache[topic].push(callback);
        		
        		// Publish cached publications to this subscriber now!
        		if (_noSubsTopics[topic]) {
        			publish(topic, [_noSubsTopics[topic]]);
        			//_noSubsTopics[topic] = null;
        		}
        		
        		return [topic, callback];
        	},

            /**
             * Disconnect a subscribed function for a topic
             * Example:
             * var handle = App.events.subscribe("/some/topic", function(a, b, c){ //handle data});
             * App.events.unsubscribe(handle);
             *
             * @submodule Events
             * @method unsubscribe
             * @param {Array} handle The return value from a Sushi.events.subscribe call
             *
             */
        	unsubscribe = function(handle){
        		var t = handle[0];
        		_cache[t] && _.each(_cache[t], function(idx){
        			if(this == handle[1]){
        				_cache[t].splice(idx, 1);
        			}
        		});
        	};

        	return {
        	    publish: publish,
        	    subscribe: subscribe,
        	    unsubscribe: unsubscribe
        	};	
    	})()
	});
	
	window.APP_CONFIG = null;
});