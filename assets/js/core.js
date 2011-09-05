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
		
		/* TODO: write actual API filtering functions here */
		
		/**
		 * Filter collection by weight.
		 *
		 * @method getByWeight
		 * @param {String} weightArray Array of weights to search for.
		 * Formats accepted: 
		 * 		50 		: will return all items with weight = 50
		 *		'10-50' : will return all items with weight between 10 and 50
		 *
		 * @returns {Array} An array with the filtered collection objects
		 */
		getByWeight: function(weightArray) {
			
		},
		
		/**
		 * Filter collection by objects that have images.
		 *
		 * @method getHasImage
		 *
		 * @returns {Array} An array with the filtered collection objects
		 */
		getHasImage: function() {
		
		},
		
		/**
		 * Filter collection by objects that have translations in the given languages.
		 *
		 * @method getHasLanguage
		 * @param {Array} languageArray Locale strings to filter collection by, ie. ['pt-PT', 'en-US'].
		 * @param {String} method Method to filter collection by. Accepts 'OR' or 'AND', default is 'AND'.
		 *
		 * @returns {Array} An array with the filtered collection objects
		 */
		getHasLanguage: function(languageArray, method) {
		
		},
		
		/**
		 * Filter collection by objects that have given user types as authors.
		 *
		 * @method getByuserType
		 * @param {Array} userTypeArray User types to filter collection by, ie. ['designer', 'developer'].
		 * @param {String} method Method to filter collection by. Accepts 'OR' or 'AND', default is 'AND'.
		 *
		 * @returns {Array} An array with the filtered collection objects
		 */
		getByuserType: function(userTypeArray, method) {
		
		},
		
		/**
		 * Filter collection by objects that were created on given dates.
		 *
		 * @method getByCreated
		 * @param {Array} dateArray Dates to filter collection by, ie ['Friday, September 2 2011', '2011-09-03'].
		 * Formats accepted: Pretty much anything Date.parse() can understand.
		 * See: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/parse
		 *
		 * @returns {Array} An array with the filtered collection objects
		 */
		getByCreated: function(dateArray) {
		
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