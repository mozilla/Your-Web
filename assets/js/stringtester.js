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
	'libs/jquery-1.6.3.min',
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
			var $el = $('<span style="font-size: 200%">' + word + '</span>').css({visibility: 'hidden'}),
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
				maxHTiles = 1,
				maxVTiles = 1,
				colTiles = 1,
				matrix = {
					grid: {}
				};
			
			if (!matrix.grid[line]) matrix.grid[line] = {};
			matrix.grid[line][column] = words[0];
			maxHTiles = words[0].hTiles;
			
			for (var w=1, len=words.length; w<len; w++) {
				if (combo[w] < numberOfBreaks) {
					line++;
					column = 1;
					maxHTiles = (maxHTiles < words[w].hTiles) ? words[w].hTiles : maxHTiles;
				} else {
					column += 1;
					maxHTiles += words[w].hTiles;
				}
				
				maxCols = (maxCols < column) ? column : maxCols;
				
				if (!matrix.grid[line]) matrix.grid[line] = {};
				
				matrix.grid[line][column] = words[w];		
			}
				
			matrix.columns = maxCols;
			matrix.maxHTiles = maxHTiles;
			matrix.lines = line;
			matrix.maxVTiles = line;

			return matrix;
		},
		
		_scoreMatrix = function(matrix) {
			
			matrix.score = matrix.lines * 10 + matrix.columns * 1.5;			
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
		
		test = function(string, model, silent) {
			if (!string || !model) return false;
			
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
			
			_cache[string].combos = _generateCombos(_cache[string].words);
			_cache[string].model = model;
			
			if (!silent) {
				app.events.publish('string/test', [_cache[string]]);
			}
		},
		
		stringThatFits = function(hTiles, vTiles) {
			
			//Loop through cache
			var candidates = _.select(_cache, function(element) {
				return !element.used;
			}),
			
			passed = [],
			
			randIdx;
			
			_.each(candidates, function(element) {
				var combos = _.select(element.combos, function(combo) {
					return combo.maxHTiles <= hTiles && combo.maxVTiles <= vTiles;
				});
				
				if (combos.length) {
					
					combos = _.sortBy(combos, function(combo) {
						return - combo.score;
					});
					
					element.combos = combos;
					
					passed.push(element);
				}
			});
			
			if (passed.length) {			
				randIdx = Math.round(Math.random()*(passed.length-1));
				
				passed[randIdx].used = true;
				
				passed[randIdx].combos[0].model = passed[randIdx].model;
				
				return passed[randIdx].combos[0];
			} else {
				return null;
			}
		}
		
		// Subscribe to interesting events
		
		// Test strings on first reset
		app.events.subscribe('tiles/reset', function(collection) {
			_cache = {};
			
			_(collection.filter(function(answer) {
				return !answer.get('image');
			})).each(function(model){
				test(model.get('content'), model, true);
			});
		});
		
		// And as they come in
		app.answers.collection.bind('add', function(model, collection) {
			test(model.get('content'), model);
		});
		
		// Public API
		return {
			test: test,
			stringThatFits: stringThatFits,
			revealCache: function() {return _cache}
		}
	})());	
});