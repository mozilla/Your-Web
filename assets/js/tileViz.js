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
	'answers',
	'tilemap',
	'stringtester'
],
function(){
	var app = window.APP,
	instance = this,
	map,
	AnswerView,
	AnswerListView,
	QuestionView,
	QuestionListView,
	AppView,
	//templates
	questionTemplate = '{{content}}',
	answerTemplate = '<article {{#if likes}}class="liked"{{/if}}>{{#if image}}<img src="{{image}}" />{{/if}}{{content}}<p class="meta">Submitted by a {{usertype}} on {{created}}{{#if userHasLiked}}<button class="btn danger unlike hide">Unlike</button> {{else}} <button class="btn success like">Like</button>{{/if}}</p></article>';
	
	app.namespace('views');
	
	// Generate the tilemap
	app.tilemap.buildMap(app.config.tilemap.lines, app.config.tilemap.columns);
	app.tilemap.render($('#tilemap').get(0));
	$('.tiled-answers').css({width: $('#tilemap').width(), height: $('#tilemap').height()});
		
	// Set up a simple view
	AnswerView = Backbone.View.extend({
		
		tagName: 'li',
		
		events: {
			'click .like' 	: 'like',
			'click .unlike'	: 'unlike'
		},
		
		template: Handlebars.compile(answerTemplate),
		
		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		
		render: function() {
			var modelData = this.model.toJSON(),
			created = new Date(modelData.created),
			classes = ['red', 'yellow', 'green', 'blue', 'pink'],
			randomInt = Math.round(Math.random() * 4),
			color = classes[randomInt];
			
			modelData.created = created.strftime('%A %d, %B %Y');
			
			$(this.el).html( this.template( modelData ) );
			
			$(this.el).addClass(color);
			
			return this;
		},
		
		remove: function() {
			$(this.el).remove();
		},
		
		clear: function() {
			this.model.destroy();
		},
		
		like: function(e) {
			this.model.like();
			this.$('.like').hide();
			this.$('.unlike').show();
		},
		
		unlike: function(e) {
			this.model.unlike();
			this.$('.like').show();
			this.$('.unlike').hide();
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
	
	// Set up the Answer List view
	AnswerListView = Backbone.View.extend({
		el: $('#content'),
		
		events: {
			'keypress #new-answer'	: 'createOnEnter'
		},
		
		initialize: function() {							
			this.input = this.$('#new-answer');
			
			this.collection.bind('add',   this.addOne);
			this.collection.bind('reset', this.applyFilters);
			this.collection.fetch();
			//app.answers.refresh();
		},
		
		addOne: function(answer) {
			var view = new AnswerView( { model: answer } );
						
			//this.$('.tiled-answers').append(view.render().el);
		},
		
		render: function(answers) {
			this.$('.tiled-answers').empty();
			answers.each(this.addOne);
			renderMap();
		},
		
		createOnEnter: function(e) {
			var text = this.input.val(),
				usertype = $('#usertype').val();
				
			if (!text || e.keyCode != 13) return;
			
			app.answers.create({content: text, usertype: usertype});
			
			this.input.val('');
		},
		
		empty: function() {
			this.$('.tiled-answers').empty();
		},
		
		applyFilters: function() {
			app.events.publish('filters/change', [app.config.filters]);
		}
	});
	
	// Set up the Question List view
	QuestionListView = Backbone.View.extend({
		el: $('#content'),
		
		events: {
			'keypress #new-question': 'createOnEnter'
		},
		
		initialize: function() {			
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
				active = $('#question_active').is(':checked'),
				newQuestion;
				
			if (!text || e.keyCode != 13) return;
			
			newQuestion = app.questions.create({content: text});
			
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
	
	app.events.subscribe('filters/change', function(filters) {
		var resultCollection = app.answers.collection,
			functionMap = {
				'usertype': 'filterByUserTypes',
				'language':	'filterByLanguages'
			}
		
		for (var key in filters) {
			resultCollection = resultCollection[ functionMap[ key ] ]( filters[key] );
		}
		
		APP.views.answerListView.render(resultCollection);
	});
	
	// Instantiate the Question List View
	app.views.QuestionListView = new QuestionListView;
	
	function renderMap() {
		var tilemap = app.tilemap,
			free,
			strings = [
				{
					content: 'This is a test',
					hTiles: 4,
					vTiles: 1
				},
				{
					content: "Horsey!",
					hTiles: 2,
					vTiles: 1
				},
				{
					content: 'Giga Puddi',
					hTiles: 3,
					vTiles: 1
				}
			]
			
		Array.prototype.binarySearch = function(find, comparator) {
		  var low = 0, high = this.length - 1,
			  i, comparison;
		  while (low <= high) {
			i = Math.floor((low + high) / 2);
			comparison = comparator(this[i], find);
			if (comparison < 0) { low = i + 1; continue; };
			if (comparison > 0) { high = i - 1; continue; };
			return i;
		  }
		  return null;
		};
		
		//for (var i=0, mLen=app.tilemap.map().length; i<mLen; i++) {
			
			free = tilemap.freeHorizontal({x:0, y:0});			
			
			var tileSizes = _.pluck(strings, 'hTiles');
						
			for (var t=0, tLen=free.length; t<tLen; t++) {
				//see if there's a string that fits
				
				// Filter the tileSizes array so that we exclude impossible matches
				_.select(tileSizes, function(size) {
					return size <= free[t].count;
				});
				
				//is there a direct match?
				//var tileSizesSorted = tileSizes.slice(0).sort();
				var exactMatch = tileSizes.binarySearch(free[t].count, function(a, b) {
					return (a - b);
				});
				
				if (exactMatch) {
					//app.log('found match!', strings[exactMatch]);
				} else {
				
				}
			}
		//}
	}
	
	// Modals
	$('#submitAnswer-modal').modal({
		backdrop: true,
		keyboard: true
	});	
	
	$('#submitQuestion, #submitAnswer').bind('submit', function() {
		return false;
	});
});