(function(ctx){

	var app = ctx.App,
	instance = this,
	AnswerView,
	QuestionView,
	AppView,
	//templates
	questionTemplate = '{{content}}';
	answerTemplate = '<article>{{#if image}}<img src="{{image}}" />{{/if}}<p>{{content}}<p> <small>Submitted by a {{#metadata}}{{usertype}}{{/metadata}} on {{#metadata}}{{created}}{{/metadata}}</small></article>';
		
	// Set up a simple view
	AnswerView = Backbone.View.extend({
		
		tagName: 'li',
		
		template: Handlebars.compile(answerTemplate),
		
		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		
		render: function() {
			var modelData = this.model.toJSON(),
			created = new Date(modelData.metadata.created);
			
			modelData.metadata.created = created.strftime('%A %d, %B %Y');
			
			$(this.el).html( this.template( modelData ) );
			
			return this;
		},
		
		setText: function() {
			var text = this.model.get('content');
			this.$('article').text(text);
		},
		
		remove: function() {
			$(this.el).remove();
		},
		
		clear: function() {
			this.model.destroy();
		}
	});
	
	QuestionView = Backbone.View.extend({
		tagName: 'h1',
		
		template: Handlebars.compile(questionTemplate),
		
		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		
		render: function() {
			var modelData = this.model.toJSON(),
			created = new Date(modelData.metadata.created);
			
			modelData.metadata.created = created.strftime('%A %d, %B %Y');
			
			$(this.el).html( this.template( modelData ) );
			
			return this;
		},
		
		remove: function() {
			$(this.el).remove();
		},
		
		clear: function() {
			this.model.destroy();
		}
	});
	
	// Set up the main App View
	AnswerListView = Backbone.View.extend({
		el: $('#content'),
		
		events: {
			"keypress #new-answer": "createOnEnter"
		},
		
		initialize: function() {
			var that = this,
				activeQuestion = app.questions.active();
				
				
			this.input = this.$("#new-answer");
			
			app.answers.bind('add',   this.addOne, this);
			app.answers.bind('reset', this.addAll, this);
			
			app.answers.fetch({data: activeQuestion});
		},
		
		addOne: function(answer) {
			var view = new AnswerView( { model: answer } );
			this.$('.answer-list').append(view.render().el);
		},
		
		addAll: function() {
			app.answers.each(this.addOne);
		},
		
		createOnEnter: function(e) {
			var text = this.input.val(),
				usertype = $('#usertype').val();
				
			if (!text || e.keyCode != 13) return;
			
			app.events.publish('answers/create', [{
				content: text,
				metadata: {
					usertype: usertype
				}
			}]);
			
			this.input.val('');
		}
	});
	
	// Set up the main App View
	QuestionListView = Backbone.View.extend({
		el: $('#content'),
		
		initialize: function() {
			var that = this;
					
			app.questions.bind('reset', this.addActive, this);
			app.questions.bind('render', this.render, this);
			
			app.questions.fetch({success: function(data) {
				// Render the Answer List
				if (app.questions.active().length) app.AnswerListView = new AnswerListView;
			}})
		},
		
		render: function() {
			this.clear();
			this.addActive();
		},
		
		addOne: function(question) {
			if (question) {
				var view = new QuestionView( { model: question } );
				this.$('.question-list').append(view.render().el);
			}
		},
		
		addAll: function() {
			app.questions.each(this.addOne);
		},
		
		addActive: function() {
			this.addOne(app.questions.active()[0]);
		},
		
		clear: function() {
			this.$('.question-list').html('');
		}
	});
	
	// Instantiate the main AppView
	app.QuestionListView = new QuestionListView;
		
})(window);