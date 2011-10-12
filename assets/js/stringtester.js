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
		
		_generateCombos = function(strObj) {
			
			var breaks = strObj.words.length - 1;
			
			//for (var breaks = 0
			
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
			_cache[string] = {};
			_cache[string].words = [];
			
			_.each(words, function(word) {				
				_cache[string].words.push({
					text: word,
					hTiles: _renderWord(word)
				});
			});
		},
		
		stringThatFits = function(hTiles, vTiles) {
		
		}
		
		// Public API
		return {
			test: test,
			stringThatFits: stringThatFits,
			getCombinations: _getPossibleCombinations
		}
	})());	
});