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
	'libs/underscore.min',
	'hash',
	'core'
],
function(){
	var app = window.APP;

	app.namespace('answers');
	
	_.extend(app.answers, (function(){
		var Answer,
		_answers,
		_createdByUser = [],
		filterList,
		AnswerList;
		
		
		//Collection filters "prototype"		
		filterList = {
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
				var returnArray =  _(this.filter(function(answer) {
					if (targetWeightLimit) {
						return (answer.get('weight') >= targetWeight && answer.get('weight') <= targetWeightLimit);
					} else {
						return answer.get('weight') == targetWeight;
					}
				}));
				
				_.extend(returnArray, filterList);
				return returnArray;
			},
			
			/**
			 * Filter collection by objects that have images.
			 *
			 * @method filterByImage
			 *
			 * @returns {Array} An array with the filtered collection objects
			 */
			filterByImage: function() {
				var returnArray = _(this.filter(function(answer) {
					return answer.get('image') && answer.get('image') != '';
				}));
				
				_.extend(returnArray, filterList);
				return returnArray;
			},
			
			/**
			 * Filter collection by objects that are authored in a given language.
			 *
			 * @method filterByLanguages
			 * @param {String, Array} languages Locale string (or array of strings) to filter collection by, ie. 'pt-PT'.
			 *
			 * @returns {Array} An array with the filtered collection objects
			 */
			filterByLanguages: function(languages) {
				languages = (!_.isArray(languages)) ? [languages] : languages;
				var returnArray = _(this.filter(function(answer) {
					return _.include(languages, answer.get('language'));
				}));
				
				_.extend(returnArray, filterList);
				return returnArray;
			},
			
			/**
			 * Filter collection by objects that have given user types as authors.
			 *
			 * @method filterByUserTypes
			 * @param {String, Array} userTypes User types to filter collection by. Can be a single string or an array of strings.
			 *
			 * @returns {Array} An array with the filtered collection objects
			 */
			filterByUserTypes: function(userTypes) {
				var returnArray;
				userTypes = (!_.isArray(userTypes)) ? [userTypes] : userTypes;

				returnArray = _(this.filter(function(answer) {
					return _.include(userTypes, answer.get('usertype'));
				}));
				
				_.extend(returnArray, filterList);
				return returnArray;
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
				
				var returnArray = _(this.filter(function(answer) {
					return new Date(answer.get('date')) >= new Date(fromDate) && new Date(answer.get('date')) <= new Date(toDate);
				}));
				
				_.extend(returnArray, filterList);
				return returnArray;
			},
			
			filterByImportant: function() {
				var returnArray = _(this.filter(function(answer) {
					return answer.get('important');
				}));
				
				_.extend(returnArray, filterList);
				return returnArray;
			}
		}
		
		// Set up the main Answer Model
		Answer = Backbone.Model.extend({
			defaults : function() {
				return {
					content	: 'My Answer',
					image	: null,
					weight	: 0,
					usertype: 'web-beginner',
					created	: new Date(),
					language: 'en-US',
					important: false,
					statistics: {
						"web-intermediate": 0,
						"web-expert": 0,
						"web-creator": 0,
						"web-beginner": 0
					}
				}
			},
			
			/* 
			 * Overriding sync method to produce different urls
			 * on CREATE
			*/
			sync: function(method, model, options){
			  	if (method=='GET'){
					options.url = model.url;
			  	} else {
					options.url = '/answers/new'; 
			  	}
			  	
			  	return Backbone.sync(method, model, options);
			}
		});	
			
		// Set up the main Answers Collection
		AnswerList = Backbone.Collection.extend({
			
			model: Answer,
			
			//localStorage: new Store('answers'),
			
			url: function( models ) {
				return '/answers/' + app.questions.getActive().get('id') + '?' + app.ui.getSerializedFilters();
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
			}
		});
		
		// Instantiate AnswerList collection
		_answers = new AnswerList;
		_.extend(_answers, filterList);
		
		
		// Subscribe to interesting events
		_answers.bind('reset', function() {
			app.events.publish('answers/refresh', [_answers]);
		});
		
		app.events.subscribe('filters/change', function() {
			_answers.url = function() {
				return '/answers/' + app.questions.getActive().get('id') + '?' + app.ui.getSerializedFilters();
			}
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
				var newModel,
					alreadyExists,
					statistics,
					newAnswer,
					filters = app.config.filters;
				
				// Check if answer already exists in current collection
				alreadyExists = _answers.filter(function(answer){
					return answer.get('content').toLowerCase() == model.content.toLowerCase() && answer.get('language') == model.language;
				});
				
				if (alreadyExists.length) {
					newModel = alreadyExists[0];
					statistics = newModel.get('statistics');
					statistics[model.usertype] += 1;
					
					newModel.set({usertype: model.usertype, statistics: statistics, important: true});
					
				} else {
					statistics = {};
					statistics[model.usertype] = 1;
					model.important = true;
					model.statistics = statistics;
					
					newModel = new Answer(model);
					newAnswer = _answers.create(newModel, {success: function(model) {
						//Put it into the createdByUser array
						_createdByUser.push(model);
						
						//Publish an event
						app.events.publish('answers/new', [model]);
						
						// If this answer is in an inactive filter or language, activate it!
						if (!_.include(filters.language, model.get('language'))) {
							$('.lang .filter').val(model.get('language'));
							
							app.config.filters.language = [model.get('language')];
							//Publish an event saying the filters changed
							app.events.publish('filters/change', [app.config.filters]);
						}
						
						if (!_.include(filters.usertype, model.get('usertype'))) {
							$('.filter[value="' + model.get('usertype') + '"]').attr('checked', '');
							
							app.config.filters.usertype.push(model.get('usertype'));
							//Publish an event saying the filters changed
							app.events.publish('filters/change', [app.config.filters]);
						}
					}});
				}
				
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
			},
			
			createdByUser: function() {return _createdByUser;}
		}
	})());	
});