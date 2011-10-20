define(
//Module dependencies
[
	'libs/jquery-1.6.4.min',
	'libs/backbone-0.5.3.min',
	'libs/underscore.min',
	'libs/handlebars',
	'libs/strftime',
	'../lib/bootstrap/js/bootstrap-modal',
	'core',
	'questions',
	'answers',
	'tilemap',
	'stringtester',
	'imagetester'
],
function(){
	var app = window.APP,
	instance = this,
	map,
	_placedObjects = [],
	AnswerView,
	AnswerDetailView,
	AnswerListView,
	QuestionView,
	QuestionListView,
	AppView,
	//templates
	questionTemplate = '<li class="question"><a href="#current-question" id="question-{{id}}">{{content}}</a></li>',
	activeQuestionTemplate = '{{content}}',
	answerTemplate = '<a href="#" title="{{content}}" class="block"><article class="tile {{color}}"><h1 class="main-title">{{#if image}}<img src="{{image.url}}" />{{else}}{{{layout}}}{{/if}}</h1></article></a>',
	answerDetailTemplate = $('#tile-detail-template').text();
	
	app.namespace('views');
	
	// Generate the tilemap
	app.tilemap.buildMap(app.config.tilemap.lines, app.tilemap.pixelsToTiles($('#main').width()), app.config.tilemap.preoccupied);
	app.tilemap.render($('#tilemap').get(0));
	$('.tiles-list').css({width: $('#tilemap').width(), height: $('#tilemap').height(), position: 'absolute', top: '0'});
	// Set up a simple view
	AnswerView = Backbone.View.extend({
		
		tagName: 'li',
		
		events: {
			'click': 'handleClick'
		},
		
		template: Handlebars.compile(answerTemplate),
		
		initialize: function() {
			this.model.bind('destroy', this.remove, this);
		},
		
		render: function(layout) {
			var modelData = this.model.toJSON(),
			created = new Date(modelData.created),
			classes = {
				'web-beginner'		: 'orange',
				'web-intermediate'	: 'yellow',
				'web-expert'		: 'green',
				'web-creator'		: 'blue'
			},
			color = classes[modelData.usertype];
			
			modelData.created = created.strftime('%A %d, %B %Y');
			
			modelData.layout = layout;
			
			modelData.color = color;
			
			$(this.el).attr('data-tile', modelData.id).html( this.template( modelData ) );
			
			return this;
		},
		
		handleClick: function() {
			app.events.publish('tile/select', [this.model, this.el]);
			return false;
		},
		
		remove: function() {
			$(this.el).remove();
		},
		
		clear: function() {
			this.model.destroy();
		}
	});
	
	AnswerDetailView = Backbone.View.extend({
		tagName: 'article',
		
		className: 'tooltip',
		
		events: {
			'click .translation-bttn': 'showTranslate'
		},
		
		template: Handlebars.compile(answerDetailTemplate),
		
		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		
		render: function() {
			var modelData = this.model.toJSON(),
				total = 0;
			
			modelData.statistics.total = 0;
			
			_.each(modelData.statistics, function(part) {
				total += parseInt(part, 10);
			});
			
			modelData.statistics.total = total;
			
			$(this.el).attr('id', 'tile-details').html( this.template( modelData ) );
			
			return this;
		},
		
		showTranslate: function() {
			$(this.el).find('#tile-detail-main').addClass('hidden');
			$(this.el).find('#translation-step-1').removeClass('hidden');
			
			return false;
		},
		
		remove: function() {
			$(this.el).remove();
		}
	});
	
	app.views.AnswerDetailView = AnswerDetailView;
	
	QuestionView = Backbone.View.extend({			
		template: Handlebars.compile(questionTemplate),
		
		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		
		render: function() {
			var modelData = this.model.toJSON(),
			created = new Date(modelData.created);
			
			modelData.created = created.strftime('%A %d, %B %Y');
			
			if (modelData.active) {
				
				this.template = Handlebars.compile(activeQuestionTemplate);
			}
			
			return this.template( modelData );
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
			'click #saveAnswer'	: 'createAnswer'
		},
		
		initialize: function() {							
			this.input = this.$('#new-answer');
			
			this.collection.bind('add',   this.addOne, this);
			this.collection.bind('reset', this.applyFilters, this);
		},
		
		addOne: function(answer) {
			var view = new AnswerView( { model: answer } );
		},
		
		render: function(answers) {
			renderTilesOnMap(answers, true);
		},
		
		createAnswer: function(e) {
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
			this.$('.tiles-list').empty();
		},
		
		applyFilters: function() {
			app.events.publish('filters/change', [app.config.filters]);
		}
	});
	
	// Set up the Question List view
	QuestionListView = Backbone.View.extend({
		el: '#primary-nav',
		
		initialize: function() {			
			app.questions.collection.bind('reset', this.clear, this);
			app.questions.collection.bind('reset', this.addAll, this);
			app.questions.collection.trigger('reset');
		},
		
		addOne: function(question) {
			var view;
			if (question) {
				view = new QuestionView( { model: question } );
				if (!question.get('active')) {
					$(this.el).append(view.render());
				} else {
					$('#current-question .current-question-btn').html(view.render());
				}
			}
		},
		
		addAll: function() {
			this.clear();
			app.questions.collection.each(this.addOne, this);
		},
		
		addActive: function() {
			this.addOne(app.questions.getActive());
		},
		
		clear: function() {
			$('#primary-nav').html('');
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
		$el = $(view.render(content).el).hide();
					
		$('.tiles-list').append($el);
			
		$el.css({position: 'absolute', top: xPos + 'px', left: yPos+ 'px', width: width, height: height});
		
		$el.fadeIn('fast');
		
		_placedObjects.push({object: obj, location: location, element: $el.get(0)});
	},
	
	_placeImageObject = function(obj, container) {
		view = new AnswerView( { model: obj.model } );
		$(container).append(view.render(obj.model.get('content')).el);
		app.ui.makeSlideShow(container);
	},
	
	fillMap = function() {
		var tilemap = app.tilemap,
			map = tilemap.map(),
			freeHTiles,
			mapWasFull = true;
		
		function recursive(line, col) {
			
			freeHTiles = tilemap.freeHorizontal( { x:line, y:col } );
			
			_.each(freeHTiles, function(free) {
				var	freeVTiles = tilemap.freeVertical( free.tile, {x:free.tile.x, y:free.tile.y + free.count } ),
					object = app.stringtester.stringThatFits(free.count, freeVTiles);
				
				if (object) {					
					if (tilemap.isTileFree(free.tile)) _placeObject(object, free.tile);
					
					mapWasFull = false;

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
		
		// If the map was already full and our objects didn't make it, substitute older tiles
		if (mapWasFull) {
			_.each(_placedObjects, function(old) {
				// See if there's an unused tile that would fit in here.
				var newObject = app.stringtester.stringThatFits(old.object.maxHTiles, old.object.maxVTiles);
				
				//Substitute old for new
				if (newObject) {
					$(old.element).fadeOut('fast', function() {
						$(this).remove();
						
						_placeObject(newObject, old.location);
					});
				}
			});
		}
		
		// Add images to their slots
		_.each(app.tilemap.imageSlots, function(slot) {
			var slotWidth = slot.lines.stop - slot.lines.start,
				slotHeight = slot.columns.stop - slot.columns.start,
				objects = app.imagetester.imagesThatFit( slotWidth, slotHeight);
			
			_.each(objects, function(object) {
				_placeImageObject(object, $('[data-imageratio="' + object.ratio + '"][data-hTiles="' + slotHeight +'"][data-vTiles="'+ slotWidth +'"]').find('.image-list'));
			});
		});
		
		tilemap.clear($('#tilemap').get(0));
		tilemap.render($('#tilemap').get(0));
	},
	
	renderTilesOnMap = function(collection) {
		var imageCollection = _(collection.filter(function(answer) { return answer.has('image') })),
			ratios = [],
			allowedSlots = [];
			
		$('.tiles-list').empty();
		
		imageCollection.each(function(answer) {
			ratios.push(
				Math.max(answer.get('image').width, answer.get('image').height) /
				Math.min(answer.get('image').width, answer.get('image').height)
			)
		});
			
		_.each(app.config.tilemap.imageSlots, function(slot) {
			var width = slot.lines.stop - slot.lines.start,
				height = slot.columns.stop - slot.columns.start,
				ratio = Math.max(width, height) / Math.min(width, height),
				$container;
				
			if (_.include(ratios, ratio) && !$('[data-imageratio="'+ ratio +'"][data-hTiles="'+ height +'"][data-vTiles="'+ width +'"]').length) {
				allowedSlots.push(slot);
				
				//render the container
				$container = $('<li><ul class="image-list"></ul></li>');
				
				$container
				.css({
					width: app.tilemap.tilesToPixels(height),
					height: app.tilemap.tilesToPixels(width),
					position: 'absolute',
					top: app.tilemap.tilesToPixels(slot.lines.start),
					left: app.tilemap.tilesToPixels(slot.columns.start)
				})
				.addClass('image')
				.attr('data-imageratio', ratio)
				.attr('data-hTiles', height)
				.attr('data-vTiles', width);
				
				$('.tiles-list').append($container);				
			}
		});
		
		app.tilemap.imageSlots = allowedSlots;
		
		app.tilemap.addImageSlots(allowedSlots);
			
		_.defer(fillMap, 500);
	};
	
	app.answers.collection.bind('reset', function(collection) {
		
		app.events.publish('tiles/reset', [collection]);
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

		app.events.publish('tiles/reset', [resultCollection]);
		app.views.answerListView.render(resultCollection);
	});
	
	// Subscribe to interesting events
	app.events.subscribe('questions/refresh', function() {
		if (app.questions.getActive()) {
			app.views.answerListView = new AnswerListView({collection: app.answers.collection});
			
			// Bootstrap answer list from config, else fetch it
			if (app.config.answers) {
				app.answers.collection.reset(app.config.answers);
			} else {
				app.answers.collection.fetch();
			}
		}
	});	
	
	app.events.subscribe('string/test', fillMap);
	
	
	// Instantiate the Question List View
	$(document).ready(function() {
		app.views.QuestionListView = new QuestionListView;
	});
});