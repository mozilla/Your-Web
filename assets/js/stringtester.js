/**
 * The String Tester module takes a string,
 * breaks it down and generates combos according
 * to the space available
 *
 * @module String Tester
 * @namespace APP
 * @class stringtester
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

	app.namespace('stringtester');
	_.extend(app.stringtester, (function(){
		
		var	tilemap = app.tilemap,
		
		_cache = {},
		
		_breakWords = function(string) {
			var wordsArray = string.split(' ');	
			
			return wordsArray;
		},
		
		_renderWord = function(word) {
			// Create a mock element
			var $el = $('<span>' + word + '</span>').css({visibility: 'hidden'}),
			width;
			
			$('body').append($el);
			width = Math.ceil($el.width());
			$el.remove();
			
			// Return width, in tiles
			return tilemap.pixelsToTiles(width);
		},
		
		_buildMatrix = function(words, combo, numberOfBreaks) {
			var line = 1,
				column = 1,
				maxCols = 1,
				matrix = {
					grid: {}
				};
			
			if (!matrix.grid[line]) matrix.grid[line] = {};
			matrix.grid[line][column] = words[0];
			
			for (var w=1, len=words.length; w<len; w++) {
			
				if (combo[w-1] < numberOfBreaks) {
					line++;
					column = 1;
				} else {
					column++;
				}
				
				maxCols = (maxCols < column) ? column : maxCols;
				
				if (!matrix.grid[line]) matrix.grid[line] = {};
				
				matrix.grid[line][column] = words[w];		
			}
						
			matrix.columns = maxCols;			
			matrix.lines = line;
			return matrix;
		},
		
		_scoreMatrix = function(matrix) {
			
			matrix.score = matrix.lines * 1.1 + matrix.columns * 1.5;			
			return matrix;
		},
		
		_generateCombos = function(words) {
			
			var comboSet = [],
				combos = [],
				variants = [];
				
			for (var i=words.length; i--; ) {
				comboSet.push(i);	
			}			
			
			combos = _getPossibleCombinations(comboSet);
						
			for (var breaks = 0, len = (words.length - 1 || 1); breaks<len; breaks++) {
				
				_.each(combos, function(combo) {
					var matrix = _scoreMatrix( _buildMatrix(words, combo, breaks) ),
						scores = _.pluck(variants, 'score');
					
					if (!_.include(scores, matrix.score)) {
						variants.push(matrix);
					}
				}); 
				
			}
			
			return variants;		
		},
		
		_getPossibleCombinations = function(arr) {
			var permArr = [], usedChars = [];
			
			arr = arr.join("");
						
			inner(arr);
			
			function inner(arr) {
				//convert input into a char array (one element for each character)
				var i, ch, chars=arr.split("");
				for (i = 0; i < chars.length; i++) {
					//get and remove character at index "i" from char array
					ch = chars.splice(i, 1);
					//add removed character to the end of used characters
					usedChars.push(ch);
					//when there are no more characters left in char array to add, add used chars to list of permutations
					if (chars.length == 0) permArr[permArr.length] = usedChars.join("");
					//send characters (minus the removed one from above) from char array to be permuted
					inner(chars.join(""));
					//add removed character back into char array in original position
					chars.splice(i, 0, ch);
					//remove the last character used off the end of used characters array
					usedChars.pop();
				}
			}			
			
			for (var i=0, len=permArr.length; i < len; i++) {
				permArr[i] = permArr[i].split("");
			}
			
			return permArr;
		},
		
		test = function(string) {
			if (!string) return false;
			
			var words = _breakWords(string);
			
			// Add string to cache
			_cache[string] = {
				used: false
			};
			_cache[string].words = [];
			
			_.each(words, function(word) {				
				_cache[string].words.push({
					text: word,
					hTiles: _renderWord(word)
				});
			});
			
			_cache[string].combos = _generateCombos(words);
		},
		
		stringThatFits = function(hTiles, vTiles) {
			//Loop through cache
			var candidates = _.select(_cache, function(element) {
				return !element.used;
			}),
			
			passed = [];
			
			_.each(candidates, function(element) {
				var combos = _.select(element.combos, function(combo) {
					return combo.columns <= hTiles && combo.lines <= vTiles;
				});
				
				combos = _.sortBy(combos, function(combo) {
					return - combo.score;
				});
				
				// Choose the one with the highest score
				passed.push(combos[0]);
			});
			
			return passed;
		}
		
		// Subscribe to interesting events
		
		// Test strings on first reset
		app.answers.collection.bind('reset', function(collection) {
			collection.each(function(model){
				test(model.get('content'));
			});
		});
		
		// And as they come in
		app.answers.collection.bind('add', function(model, collection) {
			test(model.get('content'));
		});
		
		// Public API
		return {
			test: test,
			stringThatFits: stringThatFits,
			revealCache: function() {return _cache}
		}
	})());	
});