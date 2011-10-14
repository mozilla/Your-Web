/**
 * The Hash module defines States to retrieve and 
 * store from the url hash. It exposes a public API to interact with
 * these states.
 *
 * @module Hash
 * @namespace APP
 * @class hash
 */
 define(
//Module dependencies
[
    'libs/backbone-0.5.3.min',
	'libs/underscore',
	'core'
],

function(){

	var app = window.APP;
	app.namespace('hash');
	
    _.extend(app.hash, (function(){
    
		var Hash,
		_hash,
        _state;
        
		
		// Set up the main Hash Model
		Hash = Backbone.Model.extend({
			
            
            _state: "",
            _language: new Array("aap"),
            _usertype: new Array(),
            _important: new Array(),
            _userAnswered: "",
            _currentQuestion: "",
            
            
            /**
			 * Update the current state
			 * Returns a collection of the update state collection
			 *
			 * @method state
			 */
            state: function() {
                
            
                if(this._state != window.location.hash) {
                    this._state = window.location.hash;
                    _.each(window.location.hash.split("&"), function(component){ 
                        component = component.split("=");

                        if(component[0] == "tl") {
                            this._language = component[1].split(",");
                        } else if(component[0] == "ut") {
                            this._usertype = component[1].split(",");
                        } else if(component[0] == "f") {
                            this._important = (component[1].split(",").length > 0) ? component[1].split(",") : new Array();
                        } else if(component[0] == "a") {
                            this._userAnswered = (component[1].length > 0) ? component[1] : "";
                        } else if(component[0] == "q") {
                            this._currentQuestion = (component[1].length > 0) ? component[1] : "";
                        }
                    },this);
                 }   
                return {
                        language	: this._language,
                        usertype: this._usertype,
                        important: this._important,
                        userAnswered: this._userAnswered,
                        currentQuestion: this._currentQuestion,

                    }
                
            },
            
            /**
			 * Get a non-modified collection
			 * Returns a collection of the update state collection
			 *
			 * @method state
			 */
            description : function() {
                 return {
                        language	: this._language,
                        usertype: this._usertype,
                        important: this._important,
                        userAnswered: this._userAnswered,
                        currentQuestion: this._currentQuestion,
                        state : this._state

                    }
            },
            
            
            
            /**
			 * Set up the instance
			 * Publishes an event on successful retrieval of collection, 
			 * with the updated collection as a parameter.
			 *
			 * @method init
			 */
            init: function() {
                this._language = app.config.filters.language;
                this._usertype = app.config.filters.usertype;   
                this._currentQuestion = "";  

            // Publish the done event with the current state as a payload
                
                app.events.publish('hash/done', this.state());

            // Subscribe to interesting events

            // Application events
                        
                app.events.subscribe('filters/change', function(payload) {

                    app.hash.setProperty("language",payload.language);
                    app.hash.setProperty("usertype",payload.usertype);
                    app.hash.setProperty("currentQuestion",app.questions.getActive().get('id'));                
                    
                    app.hash.refresh();

                });
                
                app.events.subscribe('questions/active', function(payload) {
                
                    app.hash.setProperty("currentQuestion",app.questions.getActive().get('id'));  
                                  
                    app.hash.refresh();

                });
                
                 app.events.subscribe('answers/new', function(payload) {
                 
                    app.hash.setProperty("userAnswered",app.answers.getActive().get('id'));  
                                  
                    app.hash.refresh();

                });
                
            // Browser events
       
                if ("onhashchange" in window) {
                    $(window).bind('hashchange', function() { 
                        app.events.publish('hash/changed', window.APP.hash.retrieve());
                        }
                    );

                } else {
                    window.setInterval(function() { 
                       if (window.location.hash != app.hash.description().state) {
                            app.events.publish('hash/changed', app.hash.retrieve());
                       }
                    }, 1000);
               
                 }

            
            
                
                
            },
			
            /**
			 * Takes the current state of the model and changes the window hash accordingly
			 *
			 * @method refresh
			 */
            
            refresh: function() {
                this._state = "&tl="+this._language.join(",")+"&ut="+this._usertype.join(",")+"&f="+this._important.join(",")+"&a="+this._userAnswered+"&q="+this._currentQuestion;
                window.location.hash = this._state;
            },
            
            
            /**
			 * Sets a property in the model
			 *
			 * @method setProperty
			 */
            setProperty: function(key, value) {
             
               this["_"+key] = value;
                
            }
            
		});	
        
        
        _hash = new Hash();
        _hash.init();


				
		// Public API
		return {
			
            
			/**
			 * Refreshes the Hash Model based on the URI hash
			 *
			 * @method refresh
			 */
			refresh: function() {
				_hash.refresh();
			},
            
            /**
			 * Retrieves updated collection from store.
			 * Publishes an event on successful retrieval of collection, 
			 * with the updated collection as a parameter.
			 *
			 * @method retrieve
			 */
            retrieve: function() {
                return _hash.state();
            },
            
            /**
			 * Retrieves updated collection from store.
			 * Publishes an event on successful retrieval of collection, 
			 * with the updated collection as a parameter.
			 *
			 * @method retrieve
			 */
            description: function() {
                return _hash.description();
            },
            
            /**
			 * Set a property of the Hash model
			 *
			 * @method setProperty
			 */
            setProperty: function(key, value) {
                _hash.setProperty(key, value);
            }
            
		}
	})());	
});
