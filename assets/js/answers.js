/**
 * The Answers module defines Models and Collections used to 
 * store answer data. It exposes a public API to interact with
 * these objects.
 *
 * @module Answers
 * @namespace APP
 * @class answers
 */
 define(
//Module dependencies
[
	'libs/backbone-0.5.3.min',
	//'libs/backbone-localstorage',
	'libs/underscore.min',
	'core'
],
function(){
	var app = window.APP;

	app.namespace('answers');
	_.extend(app.answers, (function(){
		var Answer,
		answers,
		AnswerList;
		
		// Set up the main Answer Model
		Answer = Backbone.Model.extend({
			defaults : function() {
				return {
					content	: 'My Answer',
					image	: 'http://placekitten.com/200/300',
					weight	: 0,
					usertype: 'Other',
					created	: new Date(),
					language: 'en-US',
					likes: 0
				}
			},
			
			like: function() {
				this.save({likes: this.get('likes') + 1});
			}
		});	
			
		// Set up the main Answers Collection
		AnswerList = Backbone.Collection.extend({
			
			model: Answer,
			
			//localStorage: new Store('answers'),
			
			url: function( models ) {
				return '/answers/' + app.questions.getActive().get('id');
			},
			
			/**
			 * Sort collection by weight.
			 *
			 * @method sortByWeight
			 *
			 */
			sortByWeight: function() {
				this.comparator = function(item) {
					return item.get('weight');
				}
				this.sort();
			},
			
			/**
			 * Sort collection by userType.
			 *
			 * @method sortByUserType
			 *
			 */
			sortByUserType: function() {
				this.comparator = function(item) {
					return item.get('usertype');
				}	
				this.sort();
			},
			
			/**
			 * Sort collection by date created.
			 *
			 * @method sortByCreated
			 *
			 */
			sortByCreated: function() {
				this.comparator = function(item) {
					return new Date(item.get('date'));
				}
				this.sort();
			},
			
			/**
			 * Filter collection by weight.
			 *
			 * @method filterByWeight
			 * @param {Number} targetWweight 		Weight to filter by
			 * @param {Number} targetWweightLimit 	If present, filters collection between targetWeight and targetWeightLimit
			 * Formats accepted: 
			 * 		50 		: will return all items with weight = 50
			 *		10, 50  : will return all items with weight between 10 and 50
			 *
			 * @returns {Array} An array with the filtered collection objects
			 */
			filterByWeight: function(targetWeight, targetWeightLimit) {
				return _(this.filter(function(answer) {
					if (targetWeightLimit) {
						return (answer.get('weight') >= targetWeight && answer.get('weight') <= targetWeightLimit);
					} else {
						return answer.get('weight') == targetWeight;
					}
				}));
			},
			
			/**
			 * Filter collection by objects that have images.
			 *
			 * @method filterByImage
			 *
			 * @returns {Array} An array with the filtered collection objects
			 */
			filterByImage: function() {
				return _(this.filter(function(answer) {
					return answer.get('image') && answer.get('image') != '';
				}));
			},
			
			/**
			 * Filter collection by objects that are authored in a given language.
			 *
			 * @method filterByLanguage
			 * @param {String} language Locale string to filter collection by, ie. 'pt-PT'.
			 *
			 * @returns {Array} An array with the filtered collection objects
			 */
			filterByLanguage: function(language) {
				return _(this.filter(function(answer) {
					return _.indexOf(languageArray, answer.get('language') != -1);
				}));
			},
			
			/**
			 * Filter collection by objects that have given user types as authors.
			 *
			 * @method filterByUserType
			 * @param {String} userType User types to filter collection by.
			 *
			 * @returns {Array} An array with the filtered collection objects
			 */
			filterByUserType: function(userType) {
				return _(this.filter(function(answer) {
					return answer.get('usertype') == userType;
				}));
			},
			
			/**
			 * Filter collection by objects that were created on given dates.
			 *
			 * @method filterByCreated
			 * @param {String} fromDate Starting date to filter collection by, ie 'Friday, September 2 2011'.
			 * @param {String} toDate 	Ending date to filter collection by, ie '2011-09-06'.
			 * Formats accepted: Pretty much anything Date.parse() can understand.
			 * See: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/parse
			 *
			 * @returns {Array} An array with the filtered collection objects
			 */
			filterByCreated: function(fromDate, toDate) {
				if (!toDate) toDate = fromDate;
							
				return _(this.filter(function(answer) {
					return new Date(answer.get('date')) >= new Date(fromDate) && new Date(answer.get('date')) <= new Date(toDate);
				}));
			},
			
			/**
			 * Filter collection by objects that were liked by a user
			 *
			 * @method filterByLiked
			 * @param {Integer} likes Number of likes to filter collection by.
			 *
			 * @returns {Array} An array with the filtered collection objects
			 */
			filterByLikes: function(likes) {
				likes = likes || 0;
				
				return _(this.filter(function(answer) {
					return answer.get('likes') > likes;
				}));
			} 
		});
		
		// Instantiate AnswerList collection
		_answers = new AnswerList;		
		
		// Subscribe to interesting events
		_answers.bind('reset', function() {
			app.events.publish('answers/refresh', [_answers]);
		});
				
		// Public API
		return {
			collection	: _answers,
			
			/**
			 * Creates a new object in collection
			 * Publishes an event with the newly created object as a parameter. 
			 *
			 * @method create
			 * @param {Object} model Object conforming to the structure defined in Answer.defaults
 			 * @returns {Object} newAnswer Newly created Answer Model instance.
			 */
			create: function(model) {
				var newModel = new Answer(model),
				newAnswer = _answers.create(newModel);
				app.events.publish('answers/new', [newAnswer]);
				return newAnswer;
			},
			
			/**
			 * Retrieves updated collection from store.
			 * Publishes an event on successful retrieval of collection, 
			 * with the updated collection as a parameter.
			 *
			 * @method refresh
			 */
			refresh: function() {
				_answers.fetch();
			}
		}
	})());	
});