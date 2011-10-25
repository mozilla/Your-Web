/**
 * The Questions module defines Models and Collections used to 
 * store question data. It exposes a public API to interact with
 * these objects.
 *
 * @module Questions
 * @namespace APP
 * @class questions
 */
define(
//Module dependencies
[
	'libs/backbone-0.5.3.min',
	//'libs/backbone-localstorage',
	'libs/underscore.min',
	'hash',
	'core'
],
function() {
	var app = window.APP;
	
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
					created	: new Date()
				}
			},

			toggleActive: function() {
				this.save({active: !this.get('active')});
			}
		});
		
		// Set up the main Questions Collection
		QuestionList = Backbone.Collection.extend({
			
			model: Question,
			
			//localStorage: new Store('questions'),
			
			url: function() {
				return '/questions/';
			},
			
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
				app.views.QuestionListView.addAll();
			}
		});
		
		// Instantiate QuestionList collection
		questions = new QuestionList;
		
		// Bootstrap question list from config, else fetch it
		if (app.config.questions) {
			// If the hash has an active question, set it as active
			var hashActiveQuestion = app.hash.retrieve().currentQuestion;
			
			if (hashActiveQuestion) {
				_.each(app.config.questions, function(question) {
					question.active = false;
					if (question.id == hashActiveQuestion) {
						question.active = true;
					}
				})
			}
			
			questions.reset(app.config.questions);
		} else {
			questions.fetch();
		}
		
		// Subscribe to interesting events
		questions.bind('reset', function() {			
			app.events.publish('questions/refresh', [questions]);
		});
		
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
			create: function(model) {
				var newModel = new Question(model),
				newQuestion = questions.create(newModel);
				app.events.publish('questions/new', [newQuestion]);
				
				return newQuestion;
			},
			
			/**
			 * Retrieves updated collection from store.
			 * Publishes an event on successful retrieval of collection, 
			 * with the updated collection as a parameter.
			 *
			 * @method refresh
			 */
			refresh: function() {
				questions.fetch();
			}
		}
		
	})());
});