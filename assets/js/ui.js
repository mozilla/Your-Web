define(
//Module dependencies
[
	'libs/jquery-1.6.3.min',
	'libs/underscore.min',
	'core'
],
function(){
	var app = window.APP,
		filters = app.config.filters;
	
	$(document).ready(function() {
		//Initial bootstrapping from APP.config.filters
		for (var key in filters) {
			$('.filter[data-filter-type="' + key + '"]').val(filters[key]);
		}
		
		//Binding change event
		$('.filter').bind('change', function() {
			var filterType = $(this).attr('data-filter-type'),
				$filterCollection = $('[data-filter-type="' + filterType + '"]'),
				filter = app.config.filters[filterType];
				
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
			
			app.config.filters[filterType] = filter;
			
			//Publish an event saying the filters changed
			app.events.publish('filters/change', [app.config.filters]);
		});
		
		// Modals
		$('#submitAnswer-modal').modal({
			backdrop: true,
			keyboard: true
		});	
		
		$('#submitQuestion, #submitAnswer').bind('submit', function() {
			$('#submitAnswer-modal').modal('hide');
			return false;
		});
		
	});
});