/**
 * The Browsertester module checks the used browser against the spects 
 * and both publishes an event and has a public method for running the test
 *
 * @module Browsertester
 * @namespace APP
 * @class browsertester
 */
define(
//Module dependencies
[
    'libs/backbone-0.5.3.min',
	'libs/underscore.min',
	'core'
],

function(){

	var app = window.APP;
	app.namespace('browsertester');
	
    _.extend(app.browsertester, (function(){
    
		var Hash,
        _supported,
        _browser,
        _valid,
			
		/** Holds the current state in the form of a hash 
		ie 9+
		ff 3.6+
		chrome 10+
		opera 10.6+
		ios safari 3.2+
		opera mobile 10+
		android 2.1+
		*/
		
		// Currently supported browsers + versions
		
		_supported =  {
			"webkit" : {"min":3.2}, //tested
			"mobile-safari" : {"min":3.2}, //tested
			"opera-mobile" : {"min":10.0}, //tested
			"opera" : {"min":10.6}, //tested
			"mozilla" : {"min":3.6}, //tested
			"android" : {"min":2.1},//tested
			"msie" : {"min":9.0}, //tested
			"chrome" : {"min":10.0}, //tested
	
		},      
		
		/**
		 * Checks the currently used browser against the specs
		 * Returns a boolean wether the browser is valid and publishes an event with the same boolean as a payload
		 *
		 * @method test
		 * @returns {Boolean}  flag wether the used browser is valid according to the spects
		 */
		test = function() {

			_browser = uaMatch(navigator.userAgent.toLowerCase());
			_valid = false;
			if(_supported[_browser.browser]) {
				_valid = (parseFloat(_browser.version) > _supported[_browser.browser].min) ? true: false;
			 } 
				
			//publish validated event with the result boolean as a payload.
			app.events.publish('browsertester/validated', _valid);    
			return _valid; 
							
		},
		
		/**
		 * Checks the currently used browser against a series of regex
		 * Returns a browser identifier object
		 *
		 * @method uaMatch
		 * @param {String} lowercase user agent string
		 * @returns {Object} an object with the browser label and version number 
		 */
		 
		uaMatch = function( ua ) {
		
			var matched = false;
			// Useragent RegExp
			var rwebkit = /(webkit)(?:.*version)?[ \/]([\w.]+)/,
			android = /(android)[ \/]([\w.]+)/,
			rchrome = /(chrome)[ \/]([\w.]+)/,
			ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
			rmsie = /(msie) ([\w.]+)/,
			rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;
		
			//run the Regex
			var match = android.exec( ua ) || rchrome.exec( ua ) || rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];
			
			//double check for mobile version
			if(match[1] == "opera" && ua.indexOf("mobi") != -1) {
				match[1] = "opera-mobile";
			}
			if(match[1] == "webkit" && ua.indexOf("mobile") != -1) {
				match[1] = "mobile-safari";
			}
			
			//if there is no match return an object with an empty label and 0 version number
			return { 
				browser: match[1] || "", 
				version: match[2] || "0"};

			
			
		},
					

		/**
		 * Set up the instance
		 * Publishes an event once the browser test is done, 
		 * with the validity of the browser as a parameter.
		 *
		 * @method init
		 */
		init = function() {
		   
		// Default valid value is false
		// setup and immediately validate
			_valid = false;
					
			$(function() {
				test();
			});

		}
        
        
       init();


				
		// Public API
		return {
			
			/**
			 * Public method for manual checking
			 *
			 * @method test
             * @returns {Boolean}  flag wether the used browser is valid according to the spects
			 */
			test: function() {
				return test();
			},
            
                       
		}
	})());	
});
