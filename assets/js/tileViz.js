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
	answerTemplate = '<article>{{#if image}}<img src="{{image}}" />{{/if}}{{{layout}}}<p class="meta">Submitted by a {{usertype}} on {{created}}</p></article>';
	
	app.namespace('views');
	
	// Generate the tilemap
	app.tilemap.buildMap(app.config.tilemap.lines, app.config.tilemap.columns, app.config.tilemap.preoccupied);
	app.tilemap.render($('#tilemap').get(0));
	$('.tiled-answers').css({width: $('#tilemap').width(), height: $('#tilemap').height()});
		
	// Set up a simple view
	AnswerView = Backbone.View.extend({
		
		tagName: 'li',
		
		events: {

		},
		
		template: Handlebars.compile(answerTemplate),
		
		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		
		render: function(layout) {
			var modelData = this.model.toJSON(),
			created = new Date(modelData.created),
			classes = ['red', 'yellow', 'green', 'blue', 'pink'],
			randomInt = Math.round(Math.random() * 4),
			color = classes[randomInt];
			
			modelData.created = created.strftime('%A %d, %B %Y');
			
			modelData.layout = layout;
			
			$(this.el).html( this.template( modelData ) );
			
			$(this.el).addClass(color);
			
			return this;
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
		el: $('body'),
		
		events: {
			'click #saveAnswer'	: 'createOnEnter'
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
		},
		
		createOnEnter: function(e) {
			var text = this.input.val(),
				usertype = $('#usertype').val();
			
			this.input.val('');
			
			return app.answers.create({content: text, usertype: usertype}, {
				success: function(model, response) {
					app.events.publish('answer/saved', [model, response]);
				},
				
				error: function(model, response) {
					app.events.publish('answer/saveerror', [model, response]);
				}
			});
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
	}),
	
	_placeObject = function(obj, location) {
		var tilemap = app.tilemap,
			xPos = tilemap.tilesToPixels(location.x),
			yPos = tilemap.tilesToPixels(location.y),
			width = tilemap.tilesToPixels(obj.maxHTiles),
			height = tilemap.tilesToPixels(obj.maxVTiles),
			$el,
			view,
			grids = obj.grid,
			content = '';
			
		_.each(grids, function(line) {
			_.each(line, function(word) {
				content += word.text + ' ';
			});
			content += '<br />';
		});
		
		view = new AnswerView( { model: obj.model } );
		$el = $(view.render(content).el);
					
		$('.tiled-answers').append($el);
			
		$el.css({fontSize: '200%', position: 'absolute', top: xPos + 'px', left: yPos+ 'px', width: width, height: height});
	},
	
	fillMap = function() {
		var tilemap = app.tilemap,
			map = tilemap.map(),
			freeTiles;
		
		function recursive(line, col) {
			
			freeTiles = tilemap.freeHorizontal( { x:line, y:col } );
			
			_.each(freeTiles, function(free) {
				var object = app.stringtester.stringThatFits(free.count, 50);
				
				if (object) {					
					if (tilemap.isTileFree(free.tile)) _placeObject(object, free.tile);
					/*
					for (var l=free.tile.x, len=free.tile.x + object.maxVTiles; l<=len; l++) {
						for (var c=free.tile.y; c <= free.tile.y + object.maxHTiles; c++) {
							tilemap.occupyTile({x:l, y:c});
						}
					}
					*/
					for (var l=free.tile.x, len=free.tile.x + object.maxVTiles-1; l<=len; l++) {
						for (var c=free.tile.y; c <= free.tile.y + object.maxHTiles-1; c++) {
							tilemap.occupyTile({x:l, y:c});
						}
					}
					recursive(line, free.tile.y + object.maxHTiles);
				}
			});
		}
		
		for (var l=0, len=map.length; l<len; l++) {
			recursive(l, 0);
		}
		
		tilemap.clear($('#tilemap').get(0));
		tilemap.render($('#tilemap').get(0));
	};
	
	app.answers.collection.bind('reset', function() {
		setTimeout(fillMap, 500);
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
});