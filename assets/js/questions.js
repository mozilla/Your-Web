/**
 * The Questions module defines Models and Collections used to 
 * store question data. It exposes a public API to interact with
 * these objects.
 *
 * @module Questions
 * @namespace APP
 * @class questions
 */
(function(ctx){
	var app = ctx.APP;
	
	app.namespace('questions');
	_.extend(app.questions, (function(){
		// Main objects
		var Question,
		QuestionList,
		questions;
		
		// Set up the main Question Model
		Question = Backbone.Model.extend({
			defaults: function() {
				return {
					content	: 'Which is the best Star Wars movie?',
					active	: false,
					created	: new Date(),
					language: 'en-US'
				}
			},

			toggleActive: function() {
				this.save({active: !this.get('active')});
			}
		});
		
		// Set up the main Questions Collection
		QuestionList = Backbone.Collection.extend({
			
			model: Question,
			
			localStorage: new Store('questions'),
			
			active: function() {
				return this.filter(function(question) {
					return question.get('active');
				});
			},
			
			setActive: function(question) {
				// Deactivate all others
				_.each(this.active(), function(item) {
					item.toggleActive();
				});
				
				question.toggleActive();
				this.trigger('render');
			}
		});
		
		// Instantiate QuestionList collection
		questions = new QuestionList;
		
		// Public API
		return {
			collection	: questions,
			
			/**
			 * Retrieves active question from collection.
			 *
			 * @method getActive
			 * @returns {Object} A Question Backbone Model instance.
			 */
			getActive: function() {
				return questions.active()[0];
			},
			
			/**
			 * Sets a given Backbone Model as active
			 * Publishes an event containing the newly active question as a parameter.
			 *
			 * @method setActive
			 * @param {Object} question A Question Backbone Model instance.
			 */
			setActive: function(question) {
				questions.setActive(question);
				app.events.publish('questions/active', [question]);
			},
			
			/**
			 * Creates a new object in collection
			 * Publishes an event with the newly created object as a parameter. 
			 *
			 * @method create
			 * @param 	{Object} model Object conforming to the structure defined in Question.defaults
			 * @returns {Object} newQuestion Newly created Question Model instance
			 */
			create: function(params) {
				var newQuestion = questions.create(params);
				app.events.publish('questions/new', [newQuestion]);
				
				return newQuestion;
			},
			
			/**
			 * Retrieves updated collection from store.
			 * Publishes an event on successful retrieval of collection, 
			 * with the updated collection as a parameter.
			 *
			 * @method refresh
			 * @param {Object} options Options object conforming to the jQuery.ajaxOptions structure
			 */
			refresh: function(options) {
				options = (options) ? options : {};
				
				options = _.extend(options, {
					success: function() {
						app.events.publish('questions/refresh', [questions]);
					}
				});
				
				questions.fetch(options);
			}
		}
		
	})());
})(window);