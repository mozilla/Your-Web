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
		
		test = function(image, model) {
			if (!image || !model) return false;
			
			var width = image.width,
				height = image.height;
			
			_cache[image.url] = {
				width: width,
				height: height,
				hTiles: tilemap.pixelsToTiles(height),
				vTiles: tilemap.pixelsToTiles(width),
				ratio: Math.max(width, height) / Math.min(width, height),
				model: model
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
									
				return (object.ratio == ratio && falsy);
			});
			
			return filtered;
		};
				
		// Subscribe to interesting events
		
		// Test strings on first reset
		app.answers.collection.bind('reset', function(collection) {
			_(collection.filter(function(answer) {
				return answer.get('image');
			})).each(function(model){
				test(model.get('image'), model);
			});
		});
		
		// And as they come in
		app.answers.collection.bind('add', function(model, collection) {
			test(model.get('image'), model);
		});
		
		// Public API
		return {
			test: test,
			imagesThatFit: imagesThatFit,
			revealCache: function() { return _cache ; }
		}
	})());	
});