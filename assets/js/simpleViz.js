(function(ctx){

	var app = ctx.App,
	instance = this,
	AnswerView,
	AppView,
	//templates
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
	
	// Set up the main App View
	AppView = Backbone.View.extend({
		el: $('#content'),
		
		events: {
			"keypress #new-answer": "createOnEnter"
		},
		
		initialize: function() {
			this.input = this.$("#new-answer");
			
			app.answers.bind('add',   this.addOne, this);
			app.answers.bind('reset', this.addAll, this);
			
			app.answers.fetch();
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
	
	// Instantiate the main AppView
	app.MainView = new AppView;
	
})(window);