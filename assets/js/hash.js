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
                        currentQuestion: this._currentQuestion

                    }
                
            },
            
            init: function() {
                this._language = app.config.filters.language;
                this._usertype = app.config.filters.usertype;                
                
                app.events.publish('hash/done', this.state());

                
                app.events.subscribe('filters/change', function(payload) {

                    app.hash.setProperty("language",payload.language);
                    app.hash.setProperty("usertype",payload.usertype);
                    
                    app.hash.refresh();

                });
                
                app.events.subscribe('questions/active', function(payload) {

                    app.hash.setProperty("currentQuestion",payload.content);                
                    app.hash.refresh();

                });
            
            
                
                
            },
			
            
            refresh: function() {
                this._state = "&tl="+this._language.join(",")+"&ut="+this._usertype.join(",")+"&f="+this._important.join(",")+"&a="+this._userAnswered+"&1="+this._currentQuestion;
                window.location.hash = this._state;
            },
            
            
            
            setProperty: function(key, value) {
             
               this["_"+key] = value;
                
            }
            
		});	
        
        _hash = new Hash();
        
        _hash.init();

			
		// Subscribe to interesting events
        
        
           
            
            

				
		// Public API
		return {
			
			/**
			 * Retrieves updated collection from store.
			 * Publishes an event on successful retrieval of collection, 
			 * with the updated collection as a parameter.
			 *
			 * @method refresh
			 */
			refresh: function() {
				_hash.refresh();
			},
            
            retrieve: function() {
                return _hash.state();
            },
            
            setProperty: function(key, value) {
                _hash.setProperty(key, value);
            }
            
		}
	})());	
});
