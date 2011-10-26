/**
 * The Image Tester module tests an image's
 * size and aspect ratio.
 *
 * @module Image Tester
 * @namespace APP
 * @class imagetester
 */
 define(
//Module dependencies
[
	'core',
	'libs/underscore.min',
	'tilemap'
],
function(){
	var app = window.APP;

	app.namespace('imagetester');
	_.extend(app.imagetester, (function(){
		
		var	tilemap = app.tilemap,
		
		_cache = {},
		
		test = function(image, model, silent) {
			if (!image || !model) return false;
			
			var width = image.width,
				height = image.height;
			
			_cache[image.url] = {
				width: width,
				height: height,
				hTiles: tilemap.pixelsToTiles(height),
				vTiles: tilemap.pixelsToTiles(width),
				ratio: Math.max(width, height) / Math.min(width, height),
				model: model,
				used: false,
				url: image.url
			}
			
			if (!silent) {
				app.events.publish('image/test', [_cache[image.url]]);
			}
		},
		
		imagesThatFit = function(hTiles, vTiles) {
			var ratio = Math.max(hTiles, vTiles) / Math.min(hTiles, vTiles),
				filtered;
			
			filtered = _.filter(_cache, function(object) {
				var falsy = true;
				
				if (hTiles >= vTiles) {
					falsy = (object.hTiles >= object.vTiles)
					if (!falsy) return false;
				} else {
					falsy = (object.hTiles < object.vTiles);
					if (!falsy) return false;
				}
									
				return (object.ratio == ratio && !object.used && falsy);
			});
			
			// mark as used
			_.each(filtered, function(object) {
				_cache[object.url].used = true;
			});
			
			return filtered;
		};
				
		// Subscribe to interesting events
		
		// Test strings on first reset
		app.answers.collection.bind('reset', function(collection) {
			if (collection.length) {
				_(collection.filter(function(answer) {
					return answer.get('image');
				})).each(function(model){
					test(model.get('image'), model, true);
				});
			}
		});
		
		// And as they come in
		app.answers.collection.bind('add', function(model, collection) {
			if (model.has('image')) {
				test(model.get('image'), model, false);
			}
		});
		
		// Public API
		return {
			test: test,
			imagesThatFit: imagesThatFit,
			revealCache: function() { return _cache ; }
		}
	})());	
});