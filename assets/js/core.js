(function(ctx){
	
	var app = ctx.App,
	instance = this,
	// Main objects
	Answer,
	AnswerList;
		
	// Set up the main Answers Model
	Answer = Backbone.Model.extend({
		defaults : function() {
			return {
				content	: 'My Answer',
				image	: 'http://placekitten.com/200/300',
				metadata: {
					weight	: 0,
					usertype: 'Other',
					created	: new Date(),
					language: ''
				} 
			}
		}
	});
	
	// Set up the main Answers Collection
	AnswerList = Backbone.Collection.extend({
		
		model: Answer,
		
		localStorage: new Store("todos"),
		
		/**
		 * Sort collection by weight.
		 *
		 * @method sortByWeight
		 *
		 */
		sortByWeight: function() {
			this.comparator = function(item) {
				return item.get('metadata').weight;
			}
			this.sort();
		},
		
		/**
		 * Sort collection by userType.
		 *
		 * @method sortByWeight
		 *
		 */
		sortByUserType: function() {
			this.comparator = function(item) {
				return item.get('metadata').usertype;
			}	
			this.sort();
		},
		
		/**
		 * Sort collection by date created.
		 *
		 * @method sortByWeight
		 *
		 */
		sortByCreated: function() {
			this.comparator = function(item) {
				return new Date(item.get('metadata').date);
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
			return this.filter(function(answer) {
				if (targetWeightLimit) {
					return (answer.get("metadata").weight >= targetWeight && answer.get("metadata").weight <= targetWeightLimit);
				} else {
					return answer.get("metadata").weight == targetWeight;
				}
			});
		},
		
		/**
		 * Filter collection by objects that have images.
		 *
		 * @method filterByImage
		 *
		 * @returns {Array} An array with the filtered collection objects
		 */
		filterByImage: function() {
			return this.filter(function(answer) {
				return answer.get("image") && answer.get("image") != '';
			});
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
			return this.filter(function(answer) {
				return _.indexOf(languageArray, answer.get('metadata').language) != -1;
			});
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
			return this.filter(function(answer) {
				return answer.get('metadata').usertype == userType;
			});
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
						
			return this.filter(function(answer) {
				return new Date(answer.get('metadata').date) >= new Date(fromDate) && new Date(answer.get('metadata').date) <= new Date(toDate);
			});
		}		
	});
	
	// Instantiate AnswerList collection
	app.answers = new AnswerList;
	
	//app.answers.bind('add',   app.events.publish('answers/addOne'));
	//app.answers.bind('reset', app.events.publish('answers/addAll'));
	
	// Subscribe to interesting events
	app.events.subscribe('answers/create', function(params) {
		var newModel = new Answer;
		newModel.attributes.content = params.content;
		newModel.attributes.metadata.usertype = params.metadata.usertype;
						
		app.answers.create(newModel);
	});
	
	app.events.subscribe('answers/fetch', function() {
		app.answers.fetch();
	});
	
})(window);