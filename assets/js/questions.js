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
					content: 'Which is the best Star Wars movie?',
					active: false,
					created: new Date(),
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
			collection: questions,
			
			getActive: function() {
				return questions.active()[0];
			},
			
			setActive: function(question) {
				questions.setActive(question);
				app.events.publish('questions/active', [question]);
			},
			
			create: function(params) {
				var newQuestion = questions.create(params);
				app.events.publish('questions/new', [newQuestion]);
			},
			
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