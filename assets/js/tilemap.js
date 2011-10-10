/**
 * The Tilemap module provides a basic tiled engine
 * with utility traversing and rendering functions.
 *
 * @module Tilemap
 * @namespace APP
 * @class tilemap
 */
 define(
//Module dependencies
[
	'libs/underscore.min'
],
function(){
	var app = window.APP;

	app.namespace('tilemap');
	_.extend(app.tilemap, (function(){
		
		// number of pixels in a tile.
		var _PXINTILE = 24,
		
		/* Tile Map is a multidimensional array.
		 * Occupied tiles have a value of 1, unoccupied tiles have a value of 0.
		 */
		tilemap = [],
		
		_lines = 0,
		_width = 0,
		
		_columns = 0,
		_height = 0,
		
		/**
		 * Builds a tilemap with X lines and Y columns
		 * 
		 * @param {int} lines 	Number of lines in tile map.
		 * @param {int} columns	Number of columns in tile map.
		 */
		buildTileMap = function(lines, columns) {
				
			_width = lines * _PXINTILE;
			_lines = lines;
			
			_height = columns * _PXINTILE;
			_columns = columns;
			
			for (var l=0; l <= lines; l++) {
				var line = [];
				
				for (var c=0; c <= columns; c++) {
					line.push(Math.round(Math.random()));
				}
				
				tilemap.push(line);
			}
			
			return tilemap;
		},
		
		/**
		 * Marks given tile as occupied
		 * 
		 * @param {Object} tile Hashed representation of a tile with "x" and "y" values.
		 						ie. {x: 2, y: 5} for a tile on line 2 and column 5.
		 */
		_occupyTile = function(tile) {
			tilemap[tile.x][tile.y] = 1;
		},
		
		/**
		 * Marks given tile as free
		 * 
		 * @param {Object} tile Hashed representation of a tile with "x" and "y" values.
		 						ie. {x: 2, y: 5} for a tile on line 2 and column 5.
		 */
		_freeTile = function(tile) {
			tilemap[tile.x][tile.y] = 0;
		},
		
		/**
		 * Returns true if given tile is free
		 * 
		 * @param {Object} tile Hashed representation of a tile with "x" and "y" values.
		 						ie. {x: 2, y: 5} for a tile on line 2 and column 5.
		 */
		_isTileFree = function(tile) {	
			return (tilemap[tile.x][tile.y] == 0);
		},
		
		/**
		 * Gets tile from an X and Y pixel position
		 *
		 * @param {Object} position Hash containing "x" and "y" values for pixel position.
		 */		
		_translatePixelsToPoint = function(position) {
		
		},
		
		/**
		 * Gets pixel position from an X and Y point position
		 *
		 * @param {Object} point Hash containing "x" and "y" values for point position.
		 * 
		 * @returns {Object} Hash containing pixel position
		 */	
		_translatePointToPixels = function(point) {
			return {
				x: point.x * _PXINTILE,
				y: point.y * _PXINTILE
			}
		},
		
		/**
		 * Gets number of free horizontal tiles
		 *
		 * @param {int} from 	Tile to start searching from
		 */
		freeHorizontal = function(from) {
		
		},
		
		/**
		 * Gets number of free vertical tiles
		 *
		 * @param {int} from 	Tile to start searching from
		 */
		freeVertical = function(from) {
		
		},
		
		/**
		 * Renders map inside DOM element
		 *
		 * @param {DOMElement} canvas		Canvas element to draw the map in.
		 */
		renderMap = function(canvas) {
			var ctx,
				point;
			
			if (!canvas) return false;
			
			canvas.width = _width;
			canvas.height = _height;
			
			ctx = canvas.getContext('2d');
			
			for (var l=0; l<_lines; l++) {
				for (var c=0; c<_columns; c++) {
				
					point = _translatePointToPixels({x:l, y:c});
					
					if (_isTileFree({x:l, y:c})) {
						ctx.fillStyle = "rgb(0,200,0)";
					} else {
						ctx.fillStyle = "rgb(200,0,0)";
					}
					
					ctx.strokeStyle = "rgb(255, 255, 255)";
					
					ctx.fillRect (point.x, point.y, _PXINTILE, _PXINTILE);
					ctx.strokeRect (point.x, point.y, _PXINTILE, _PXINTILE);
				}
			}
			
		};
		
		// Public API
		return {
			freeHorizontal: freeHorizontal,
			freeVertical: freeVertical,
			buildMap: buildTileMap,
			map: tilemap,
			render: renderMap
		}
	})());	
});