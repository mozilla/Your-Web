define(
//Module dependencies
[
	'libs/jquery-1.6.4.min',
	'libs/underscore.min',
	'libs/handlebars',
	'libs/jquery.cycle.lite',
	'libs/jquery.uniform',
	'libs/jquery.validationEngine',
	'core',
	'hash'
],
function(){
	var app = window.APP,
		filters = app.config.filters;
		
	app.namespace('ui');
	
	// Validation Engine language
	$.fn.validationEngineLanguage = function(){};
	$.validationEngineLanguage = {
        newLang: function(){
        	$.validationEngineLanguage.allRules = app.config.strings.validation;
        }
    };
	$.validationEngineLanguage.newLang();
	
	_.extend(app.ui, (function() {
		
		var serializeFilters = function() {
			return $.param(filters);
		},
		
		makeSlideShow = function(element) {
			$(element).cycle({
				before: function(oldImg, newImg) {
					var oldTooltip = $('#tile-details[data-tile="' + $(oldImg).attr('data-tile') + '"]');
					
					if (oldTooltip.length) {
						oldTooltip.find('.close-bttn').trigger('click');
						$(newImg).find('a').trigger('click');
					}
				}
			});
		},
		
		makeTooltip = function(content, element, options) {
			var tooltipTemplate = Handlebars.compile('<div>{{{content}}}</div>'),
			$tooltip = $(tooltipTemplate({content: content})),
			$arrow,
			leftAdjust,
			canvasWidth,
			classNames,
			selector = '',
			tooltipWidth,
			elPos;
			
			_.defaults(options, {
				exclusive: false,
				className: 'tooltip',
				appendTo: 'body',
				offsetTop: 0,
				show: true
			});
			
			elPos = $(element).offset();
			elPos.left = $(element).position().left;
			
			canvasWidth = $(options.appendTo).width();
			
			if (options.exclusive) {
				$(options.appendTo).find('.tooltip').remove();
			}
			
			$tooltip.get(0).className = 'tooltip ' + options.className;
			
			$tooltip
			.css({
				visibility: 'hidden',
				position: 'absolute',
				zIndex: 4000,
				top: parseInt(elPos.top + $(element).height() + options.offsetTop, 10)
			});
					
			$tooltip.appendTo(options.appendTo);
			
			if (options.show) {
				$tooltip.css({visibility: 'visible'}).hide().fadeIn('fast');
			}
			
			leftAdjust = ( Math.max($(element).width(), $tooltip.width()) - Math.min($(element).width(), $tooltip.width()) ) / 2;
			$tooltip.css({left: elPos.left - leftAdjust});
			
			//Position arrow
			$arrow = $tooltip.find('.sup-title');
			$arrow.css({backgroundPositionX: leftAdjust - $(element).width() / 2});
			
			// Edge cases
			if ( parseInt($tooltip.position().left + $tooltip.width(), 10) > canvasWidth) {
				$tooltip.css({left: 'auto', right: 0});
				
				var y = $(element).width(),
					z = canvasWidth - $(element).position().left - y,
					x = $tooltip.width() - z - y,
					p;
				
				p = ( (y/2) + x ) + 22;
				
				$arrow.css({backgroundPositionX: p});
			}
			
			if ( $tooltip.position().left < 0) {
				$tooltip.css({left: 0, right: 'auto'});
				
				var y = $(element).width(),
					z = $(element).position().left,
					p;
				
				p = ( z + y / 2 ) + 22;
				
				$arrow.css({backgroundPositionX: p});	
			}
			
			return {
				show: function() {
					$tooltip.fadeIn('fast');
				},
				element: $tooltip.get(0)
			};
		}
		
		// Event subscription
		app.events.subscribe('hash/done', function(state) {
			// Usertype
			filters.usertype = [];
			_.each(state.usertype, function(type) {
				filters.usertype.push(type);
			});
			
			// Language
			filters.language = state.language;
		});
		
		// Public API
		return {
			getSerializedFilters: serializeFilters,
			makeSlideShow		: makeSlideShow,
			makeTooltip			: makeTooltip
		}
	})());
	
	$(document).ready(function() {	
		//Initial bootstrapping from APP.config.filters
		for (var key in filters) {
			$('.filter[data-filter-type="' + key + '"]').val(filters[key]);
		}
		
		//Binding filters change event
		$('.filter').bind('change', function() {
			var filterType = $(this).attr('data-filter-type'),
				$filterCollection = $('[data-filter-type="' + filterType + '"]'),
				filter = app.config.filters[filterType],
				checkedNr = $('.filter[type="checkbox"]:checked').length;
				
			$(this).attr('value', $(this).val());
			filter = [];		
			$filterCollection.each(function() {
				
				if ($(this).attr('type') == 'checkbox') {
					if ($(this).is(':checked')) {
						filter.push($(this).val());
					}
				} else {
					filter.push($(this).val());
				}
			});
			
			// Prevent last checked filter from being unchecked
			if (checkedNr == 1) {
				$('.filter[type="checkbox"]:checked').attr('disabled', '');
			} else {
				$('.filter[type="checkbox"]').removeAttr('disabled');
			}
			
			app.config.filters[filterType] = filter;
			
			//Publish an event saying the filters changed
			app.events.publish('filters/change', [app.config.filters]);
		});
		
		
		// Question List tooltip
		$('#current-question .current-question-btn').bind('click', function() {
			var tooltip = app.ui.makeTooltip($('#primary-nav-wrapper').html(), $('#current-question'), {exclusive: true, className: 'questionList', appendTo: $('#wrapper')});
			
			$('#primary-nav .question a').unbind();
			
			$('#primary-nav .question a').live('click', function() {
				var $this = $(this),
					id = $this.attr('id').replace('question-', ''),
					question = app.questions.collection.get(id);
					
				app.questions.setActive(question);
				
				$(tooltip.element).remove();
				
				return false;
			});
			
			return false;
		});
		
		
		// Submit tooltips
		$('#tile-cta-bttn, #answer-form-shortcut input[type="submit"]').bind('click', function() {
			var offsetTop = ($(this).attr('id') == 'tile-cta-bttn') ? 60 : 20,			
				submitAnswerTooltip = app.ui.makeTooltip($('#submitAnswer-template').text(), $(this), {exclusive: true, className: 'submitAnswer large', offsetTop: offsetTop, appendTo: $('#wrapper')}),
				model;
				
			//Validation
			$(submitAnswerTooltip.element).find('form').validationEngine(app.config.validation);
			$('form').validationEngine('hide');
			
			// Populate the answer field with the pre-answer value
			$(submitAnswerTooltip.element).find('.answer-text').val($('#answer-form-shortcut .answer-pre-text').val());
			
			// Populate the question field with the active question
			$(submitAnswerTooltip.element).find('#answer-step-1 .main-title').text(app.questions.getActive().get('content'));
			
			app.events.subscribe('answer/saved', function() {
				// Clear the forms, hide the modal
				$(submitAnswerTooltip.element).find('.tooltip-close-bttn-wrapper').trigger('click');
							 
				$('#answer-form-shortcut .answer-pre-text').val('');
			});
			
			$(submitAnswerTooltip.element).delegate('.answer-text', 'keyup', function() {
				var $this = $(this),
					charCount = $(this).val().length,
					$counter = $('.answer-text-counter'),
					limit = parseInt($counter.attr('data-counter-limit'), 10),
					result = (limit - charCount > 0) ? limit - charCount : 0;
				
				$counter.find('.count').text(result);
				
				if (result <= 5) {
					$counter.addClass('highlight');
				} else {
					$counter.removeClass('highlight');
				}
				
				if (result <= 0) {
					$this.val($this.val().substr(0, limit));
				}				
			});
		
			$(submitAnswerTooltip.element).delegate('.tooltip-close-bttn-wrapper', 'click', function() {
				if (model) {
					app.answers.create(model);
					model = null;
				}
				
				$(submitAnswerTooltip.element).find('form').validationEngine('hide');
				
				$(submitAnswerTooltip.element).fadeOut('fast');
				
				return false;
			});
			
			$(submitAnswerTooltip.element).delegate('#answer-step-1 form', 'submit', function() {
				$('#answer-step-1').addClass('hidden');
				$('#answer-step-2').removeClass('hidden');
				
				model = {};
				
				model.content = $('#answer-step-1').find('.answer-text').val();
				model.usertype = $('#answer-step-1').find('input[name="usertype"]:checked').attr('id');
				model.important = true;
				model.language = $('#answer-step-1').find('.language select').val();
				
				return false;
			});
			
			$(submitAnswerTooltip.element).delegate('#answer-step-2 .tooltip-skip-bttn-wrapper', 'click', function() {
				if (model) {
					app.answers.create(model);
					model = null;
				}
				
				$(submitAnswerTooltip.element).fadeOut('fast');
				
				return false;
			});
			
			$(submitAnswerTooltip.element).delegate('#answer-step-2 form', 'submit', function() {
				var endpoint = app.config.endpoints.emailSubscription,
					formData = $(this).serialize();
					
				if (!endpoint ) return false;
				
				$.ajax({
					url: endpoint.url,
					dataType: endpoint.dataType,
					data: formData,
					success: function() {
						if (model) {
							app.answers.create(model);
						}
						
						$(submitAnswerTooltip.element).fadeOut('fast');
						
						return false;
					}
				});
				
				return false;
			});
			
			return false;
		});
		
		// Bind Answer Detail tooltip close button
		$('.tiles-list').delegate('.tooltip-close-bttn-wrapper a', 'click', function() {
			var $details = $('#tile-details');
			$details.find('form').validationEngine('hide');
			$details.remove();
			
			return false;
		});
		
		// Tile click event
		function handleTileClick(model, element) {
			var view = new app.views.AnswerDetailView({model: model}),
			$tooltip = $(view.render().el),
			offsetTop = 5,
			$arrow,
			leftAdjust,
			canvasWidth = $('.tiles-list').width(),
			$closestImage = $(element).closest('.image'),
			tweet_button,
			elPos;
			
			if ($closestImage.length) {
				element = $closestImage;
			}
			
			elPos = $(element).position();
			
			$tooltip.find('form').validationEngine(app.config.validation);
			
			$('.tooltip-close-bttn-wrapper a').trigger('click');
			
			$tooltip
			.attr('data-tile', model.get('id') || model.cid)
			.css({
				position: 'absolute',
				zIndex: 4000,
				top: parseInt(elPos.top + $(element).height() + offsetTop, 10)
			});
					
			$('.tiles-list').append($tooltip);
			
			leftAdjust = ( Math.max($(element).width(), $tooltip.width()) - Math.min($(element).width(), $tooltip.width()) ) / 2;
			$tooltip.css({left: elPos.left - leftAdjust});
			
			//Position arrow
			$arrow = $tooltip.find('.sup-title');
			$arrow.css({backgroundPositionX: leftAdjust + $(element).width() / 2 - 33});
			
			// Edge cases
			if ( parseInt($tooltip.position().left + $tooltip.width(), 10) > canvasWidth) {
				$tooltip.css({left: 'auto', right: 0});
				
				var y = $(element).width(),
					z = canvasWidth - $(element).position().left - y,
					x = $tooltip.width() - z - y,
					p;
				
				p = ( (y/2) + x );
				
				$arrow.css({backgroundPositionX: p});				
			}
			
			if ( $tooltip.position().left < 0) {
				$tooltip.css({left: 0, right: 'auto'});
				
				var y = $(element).width(),
					z = $(element).position().left,
					p;
				
				p = ( z + y / 2 );
				
				$arrow.css({backgroundPositionX: p});	
			}
		}
		
		//Translation form submission
		$('#translation-step-1 form').live('submit', function() {
			var endpoint = app.config.endpoints.translationSubmission,
				$submit = $(this).find('input[type="submit"]'),
				formData = $(this).serialize();
					
				if (!endpoint ) return false;
				
				$submit.addClass('loading').val(app.config.strings.formSubmitLoading);
				
				$.ajax({
					url: endpoint.url,
					dataType: endpoint.dataType,
					method: 'POST',
					data: formData,
					success: function() {
						$('#translation-step-1').addClass('hidden');
						$('#translation-step-2').removeClass('hidden');
					}
				});
			
			return false;
		});
		
		//Subscribe to interesting events
		app.events.subscribe('tile/select', handleTileClick);
		
	});
});