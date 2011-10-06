define(
//Module dependencies
[
	'libs/jquery-1.6.3.min',
	'libs/backbone-0.5.3.min',
	'libs/underscore.min',
	'libs/handlebars',
	'libs/strftime',
	'../lib/bootstrap/js/bootstrap-modal',
	'core',
	'questions',
	'answers'
],
function(){
	var app = window.APP,
	instance = this,
	AnswerView,
	QuestionView,
	AppView,
	//templates
	questionTemplate = '{{content}}';
	answerTemplate = '<article {{#if likes}}class="liked"{{/if}}>{{#if image}}<img src="{{image}}" />{{/if}}<p>{{content}}<p> <small>Submitted by a {{usertype}} on {{created}}</small> <button class="btn success like">Like</button></article>';
	
	app.namespace('views');
		
	// Set up a simple view
	AnswerView = Backbone.View.extend({
		
		tagName: 'li',
		
		events: {
			'click .like' : 'like'
		},
		
		template: Handlebars.compile(answerTemplate),
		
		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		
		render: function() {
			var modelData = this.model.toJSON(),
			created = new Date(modelData.created);
			
			modelData.created = created.strftime('%A %d, %B %Y');
			
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
		},
		
		like: function(e) {
			this.model.like();
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
			created = new Date(modelData.created);
			
			modelData.created = created.strftime('%A %d, %B %Y');
			
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
			'keypress #new-answer'	: 'createOnEnter'
		},
		
		initialize: function() {							
			this.input = this.$('#new-answer');
			
			this.collection.bind('add',   this.addOne, this);
			this.collection.bind('reset', this.render, this);
			this.collection.fetch();
			//app.answers.refresh();
		},
		
		addOne: function(answer) {
			var view = new AnswerView( { model: answer } );
			this.$('.answer-list').append(view.render().el);
		},
		
		render: function(answers) {
			this.$('.answer-list').empty();
			//app.answers.collection.each(this.addOne);
			answers.each(this.addOne);
		},
		
		createOnEnter: function(e) {
			var text = this.input.val(),
				usertype = $('#usertype').val();
				
			if (!text || e.keyCode != 13) return;
			
			app.answers.create({content: text, usertype: usertype});
			
			this.input.val('');
		},
		
		empty: function() {
			this.$('.answer-list').empty();
		}
	});
	
	// Set up the main App View
	QuestionListView = Backbone.View.extend({
		el: $('#content'),
		
		events: {
			'keypress #new-question': 'createOnEnter'
		},
		
		initialize: function() {
			var that = this;
			
			this.input = this.$('#new-question');
					
			app.questions.collection.bind('reset', this.addActive, this);
			app.questions.collection.bind('render', this.render, this);
			
			app.questions.refresh();
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
			app.questions.collection.each(this.addOne);
		},
		
		addActive: function() {
			this.addOne(app.questions.getActive());
		},
		
		clear: function() {
			this.$('.question-list').html('');
		},
		
		createOnEnter: function(e) {
			var text = this.input.val(),
				active = $('#question_active').is(':checked');
				
			if (!text || e.keyCode != 13) return;
			
			var newQuestion = app.questions.create({content: text});
			
			if (active) app.questions.setActive(newQuestion);
			
			this.input.val('');
		}
	});
	
	// Subscribe to interesting events
	app.events.subscribe('questions/refresh', function() {
		if (app.questions.getActive()) app.views.answerListView = new AnswerListView({collection: app.answers.collection});
	});
	
	app.events.subscribe('questions/active', function() {
		if (app.questions.getActive()) {
			app.views.answerListView.empty();
			app.answers.refresh();
		}
	});
	
	// Instantiate the main AppView
	app.views.QuestionListView = new QuestionListView;
	
	$('#submitAnswer-modal').modal({
		backdrop: true,
		keyboard: true
	});
	
	$('#submitQuestion, #submitAnswer').bind('submit', function() {
		return false;
	});
});