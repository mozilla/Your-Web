define(
[
	'libs/sinon-1.2.0'
],
function() {
	var app = window.APP;
	app.namespace('server');
	
	_.extend(app.server, (function() {
		var server = sinon.fakeServer.create();
		
		var questions,
		/*questions = '[\
								{\
									"id":"7bd1255f-6efe-983a-6918-52b213d8d176",\
									"content":"This is a test",\
									"active":true,\
									"created":"2011-10-04T15:48:22.507Z",\
									"language":"en-US"\
								},\
								{\
									"id":"7bd1255f-6efe-983a-6918-91e017177342",\
									"content":"This is another anwser",\
									"active":false,\
									"created":"2011-10-04T16:48:22.507Z",\
									"language":"en-US"\
								}\
							]',
		*/
		answersFor1 = '[\
							{\
								"content":"Kittens",\
								"weight":16,\
								"usertype":"web-expert",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-creator": 3,\
									"web-beginner": 20\
								},\
								"id":"44cc74df-1e8e-0abb-fc8e-a45a50130d1d"\
							},\
							{\
								"content":"Foxes on Fire!!",\
								"weight":16,\
								"usertype":"web-creator",\
								"created":"2011-10-04T16:13:02.284Z",\
								"statistics": {\
									"web-intermediate": 1,\
									"web-expert": 2\
								},\
								"id":"c0176d62-782f-d0b7-1a57-91e017177342"\
							},\
							{\
								"content":"Open Source",\
								"weight":18,\
								"usertype":"web-expert",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"44cc74df-1e8e-0abb-fc8e-a43a50130d1d"\
							},\
							{\
								"content":"Free",\
								"weight":20,\
								"usertype":"web-expert",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"c0176d62-782f-d0b7-1a57-91e017177642"\
							},\
							{\
								"content":"Beer",\
								"weight":22,\
								"usertype":"web-beginner",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 120\
								},\
								"id":"44cc74df-1e8e-0abb-fc8e-a73a50130d1d"\
							},\
							{\
								"content":"Giga Puddi",\
								"weight":20,\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 5,\
									"web-beginner": 7\
								},\
								"id":"c0176d62-782f-d0b7-1a27-91e017177642"\
							},\
							{\
								"content":"Raposas!!",\
								"weight":18,\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"pt-PT",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 0,\
									"web-creator": 3,\
									"web-beginner": 20\
								},\
								"id":"c0176d62-782f-d0b7-1a57-91e017177342"\
							},\
							{\
								"content":"Kittens gone wild",\
								"weight":16,\
								"usertype":"web-creator",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 5,\
									"web-beginner": 7\
								},\
								"id":"44cc74df-1e8e-02bb-fc8e-a45a50130d1d"\
							},\
							{\
								"content":"Communication",\
								"weight":22,\
								"usertype":"web-creator",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"c0176d62-782f-d027-1a57-91e017177342"\
							},\
							{\
								"content":"Openness!",\
								"weight":20,\
								"usertype":"web-expert",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 24,\
									"web-creator": 52,\
									"web-beginner": 1\
								},\
								"id":"44cc74df-1e8e-0a2b-fc8e-a43a50130d1d"\
							},\
							{\
								"content":"Books",\
								"weight":18,\
								"image": {\
											"url": "http://placekitten.com/500/500",\
											"width": 500,\
											"height": 500\
										  },\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-creator": 2,\
									"web-beginner": 55\
								},\
								"id":"c0176d62-782f-d027-1a57-91e017177642"\
							},\
							{\
								"content":"Keypads",\
								"weight":22,\
								"image": {\
											"url": "http://placekitten.com/300/300",\
											"width": 500,\
											"height": 500\
										  },\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"44cc74df-1e8e-0a24-fc8e-a73a50130d1d"\
							},\
							{\
								"content":"No more mice",\
								"weight":16,\
								"usertype":"web-beginner",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 1,\
									"web-expert": 2\
								},\
								"id":"c0176d62-782f-d0f7-1a27-91e017177642"\
							},\
							{\
								"content":"Browser wars",\
								"weight":16,\
								"image": {\
											"url": "http://placekitten.com/400/300",\
											"width": 400,\
											"height": 300\
										  },\
								"usertype":"web-beginner",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"pt-PT",\
								"statistics": {\
									"web-intermediate": 122,\
									"web-expert": 41,\
									"web-beginner": 11\
								},\
								"id":"c0176da2-732f-d0b7-1a57-91e017177342"\
							},\
							{\
								"content":"Kittens and dogs",\
								"weight":16,\
								"usertype":"web-expert",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-creator": 3,\
									"web-beginner": 20\
								},\
								"id":"44cd74df-1e8e-0xbb-fc8e-a45a50130d1d"\
							},\
							{\
								"content":"Love for everyone!",\
								"weight":16,\
								"usertype":"web-creator",\
								"created":"2011-10-04T16:13:02.284Z",\
								"statistics": {\
									"web-intermediate": 1,\
									"web-expert": 2\
								},\
								"id":"c0176d62-782f-d0b7-1a57-91e017977342"\
							},\
							{\
								"content":"HTML5 love all over",\
								"weight":18,\
								"usertype":"web-expert",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"44cc74df-1e8e-0abb-fc8e-243a50130d1d"\
							},\
							{\
								"content":"Netscape Navigator",\
								"weight":20,\
								"usertype":"web-expert",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"c0176d62-782f-d0b7-1a57-91e017177642"\
							},\
							{\
								"content":"HAL",\
								"weight":22,\
								"usertype":"web-beginner",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 120\
								},\
								"id":"44c074df-1e8e-0abb-fc8e-a73a50130d1d"\
							},\
							{\
								"content":"Giga Chocolate Pudding",\
								"weight":20,\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 5,\
									"web-beginner": 7\
								},\
								"id":"c0176d62-782f-d0b7-1a97-91e017177642"\
							},\
							{\
								"content":"Acesso Universal",\
								"weight":18,\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"pt-PT",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 0,\
									"web-creator": 3,\
									"web-beginner": 20\
								},\
								"id":"c0176pd2-782f-d0b7-1a57-91e017177342"\
							},\
							{\
								"content":"Smartphone",\
								"weight":16,\
								"usertype":"web-creator",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 5,\
									"web-beginner": 7\
								},\
								"id":"44cc74df-1e9e-02bb-fc8e-a45a50130d1d"\
							},\
							{\
								"content":"IRC comeback",\
								"weight":22,\
								"usertype":"web-creator",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"c0171d62-782f-d027-1a57-91e017177342"\
							},\
							{\
								"content":"Direct Democracy",\
								"weight":20,\
								"usertype":"web-expert",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 24,\
									"web-creator": 52,\
									"web-beginner": 1\
								},\
								"id":"44cc74df-1e8e-0a2b-fc8e-a43a50830d1d"\
							},\
							{\
								"content":"Open Government",\
								"weight":18,\
								"image": {\
											"url": "http://placekitten.com/500/500",\
											"width": 500,\
											"height": 500\
										  },\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-creator": 2,\
									"web-beginner": 55\
								},\
								"id":"c0166d62-782f-d027-1a57-91e017177642"\
							},\
							{\
								"content":"Natural Gesture Interface",\
								"weight":22,\
								"image": {\
											"url": "http://placekitten.com/300/300",\
											"width": 500,\
											"height": 500\
										  },\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"44cc74df-1e8e-0a74-fc8e-a73a50130d1d"\
							},\
							{\
								"content":"Voice Controlled",\
								"weight":16,\
								"usertype":"web-beginner",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 1,\
									"web-expert": 2\
								},\
								"id":"c0176d62-782f-d0f7-1a27-91e137177642"\
							},\
							{\
								"content":"Activity Streams",\
								"weight":16,\
								"image": {\
											"url": "http://placekitten.com/400/300",\
											"width": 400,\
											"height": 300\
										  },\
								"usertype":"web-beginner",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"pt-PT",\
								"statistics": {\
									"web-intermediate": 122,\
									"web-expert": 41,\
									"web-beginner": 11\
								},\
								"id":"c0176d62-732f-d0b7-1a57-91e017175342"\
							},\
							{\
								"content":"TRADEMARKED",\
								"weight":20,\
								"usertype":"web-expert",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 24,\
									"web-creator": 52,\
									"web-beginner": 1\
								},\
								"id":"44cc74df-1G8j-0a2b-fc8e-a43a50130d1d"\
							},\
							{\
								"content":"Carbon Copied",\
								"weight":18,\
								"image": {\
											"url": "http://placekitten.com/500/500",\
											"width": 500,\
											"height": 500\
										  },\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-creator": 2,\
									"web-beginner": 55\
								},\
								"id":"c0176d62-782f-d097-1a57-91e017177642"\
							},\
							{\
								"content":"Creative Commons",\
								"weight":22,\
								"image": {\
											"url": "http://placekitten.com/300/300",\
											"width": 500,\
											"height": 500\
										  },\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"44c274df-1e8e-0a84-fc8e-a73a50130d1d"\
							},\
							{\
								"content":"Large Displays",\
								"weight":16,\
								"usertype":"web-beginner",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 1,\
									"web-expert": 2\
								},\
								"id":"c0176d62-782f-r0f7-1a27-91e017177642"\
							},\
							{\
								"content":"Brain implanted",\
								"weight":16,\
								"image": {\
											"url": "http://placekitten.com/400/300",\
											"width": 400,\
											"height": 300\
										  },\
								"usertype":"web-beginner",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"pt-PT",\
								"statistics": {\
									"web-intermediate": 122,\
									"web-expert": 41,\
									"web-beginner": 11\
								},\
								"id":"c0176d52-732f-d0b7-1a57-91e017177342"\
							},\
							{\
								"content":"Democratic!",\
								"weight":16,\
								"usertype":"web-expert",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-creator": 3,\
									"web-beginner": 20\
								},\
								"id":"44cd74df-1e8y-0xbb-fc8e-a45a50130d1d"\
							},\
							{\
								"content":"FREE",\
								"weight":16,\
								"usertype":"web-creator",\
								"created":"2011-10-04T16:13:02.284Z",\
								"statistics": {\
									"web-intermediate": 1,\
									"web-expert": 2\
								},\
								"id":"c0176d62-782f-d027-1a57-91e017977342"\
							},\
							{\
								"content":"Representing the People",\
								"weight":18,\
								"usertype":"web-expert",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"14cc74df-1e8e-0abb-fc8e-243a50130d1d"\
							},\
							{\
								"content":"Easy to use for my dad",\
								"weight":20,\
								"usertype":"web-expert",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"c0176d62-782f-d0b7-1a57-91e917177642"\
							},\
							{\
								"content":"Lorem Ipsum Dolorem Est",\
								"weight":22,\
								"usertype":"web-beginner",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 120\
								},\
								"id":"44c074df-1e8e-0abb-fc8e-a73a50130d14"\
							},\
							{\
								"content":"Data portability",\
								"weight":20,\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 5,\
									"web-beginner": 7\
								},\
								"id":"c0176d62-782f-d2b7-1a97-91e017177642"\
							},\
							{\
								"content":"Interplanetary",\
								"weight":18,\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"pt-PT",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 0,\
									"web-creator": 3,\
									"web-beginner": 20\
								},\
								"id":"c01764d2-782f-d0b7-1a57-91e017177342"\
							},\
							{\
								"content":"ON MARS!",\
								"weight":16,\
								"usertype":"web-creator",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 5,\
									"web-beginner": 7\
								},\
								"id":"44cc74df-1efe-02bb-fc8e-a45a50130d1d"\
							},\
							{\
								"content":"I want it to be OPEN",\
								"weight":22,\
								"usertype":"web-creator",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"c0171d62-782f-d027-1a57-91e017137342"\
							},\
							{\
								"content":"FREE FROM BIG EVIL INC",\
								"weight":20,\
								"usertype":"web-expert",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 24,\
									"web-creator": 52,\
									"web-beginner": 1\
								},\
								"id":"44cc74df-1e8e-0a2b-fc8e-343a50830d1d"\
							},\
							{\
								"content":"Not in the hands of Telcos",\
								"weight":18,\
								"image": {\
											"url": "http://placekitten.com/500/500",\
											"width": 500,\
											"height": 500\
										  },\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-creator": 2,\
									"web-beginner": 55\
								},\
								"id":"c016ad62-782f-d027-1a57-91e017177642"\
							},\
							{\
								"content":"A basic human right",\
								"weight":22,\
								"image": {\
											"url": "http://placekitten.com/300/300",\
											"width": 500,\
											"height": 500\
										  },\
								"usertype":"web-intermediate",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"44cc74df-1e8e-ya74-fc8e-a73a50130d1d"\
							},\
							{\
								"content":"Semantic",\
								"weight":16,\
								"usertype":"web-beginner",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 1,\
									"web-expert": 2\
								},\
								"id":"c0176d62-ad2f-d0f7-1a27-91e137177642"\
							},\
							{\
								"content":"Awesome",\
								"weight":16,\
								"image": {\
											"url": "http://placekitten.com/400/300",\
											"width": 400,\
											"height": 300\
										  },\
								"usertype":"web-beginner",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"pt-PT",\
								"statistics": {\
									"web-intermediate": 122,\
									"web-expert": 41,\
									"web-beginner": 11\
								},\
								"id":"c0176d62-732f-d0b7-23r7-91e017175342"\
							}\
						]',

		answersFor2 = '[\
							{\
								"content":"Moar Lulz!",\
								"image": {\
											"url": "http://placekitten.com/200/300",\
											"width": 200,\
											"height": 300\
										  },\
								"weight":22,\
								"usertype":"web-creator",\
								"created":"2011-10-04T16:13:12.492Z",\
								"language":"en-US",\
								"statistics": {\
									"web-intermediate": 12,\
									"web-expert": 50,\
									"web-creator": 32,\
									"web-beginner": 11\
								},\
								"id":"0e010311-d281-7185-f91a-1c3131ce9ddb"\
							}\
						]',
		
		answers = {"7bd1255f-6efe-983a-6918-52b213d8d176": answersFor1, "7bd1255f-6efe-983a-6918-91e017177342": answersFor1};
						
	
		server.respondWith('/questions/', function (xhr) {
			xhr.respond(200, { "Content-Type": "application/json" }, questions);
		});
		
		server.respondWith(/\/answers\/([a-f0-9\-]+)/, function (xhr, id) {
			xhr.respond(200, { "Content-Type": "application/json" }, answers[id]);
		});
		
		server.respondWith('/answers/new', function(xhr) {
			function guidGenerator() {
				var S4 = function() {
				   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
				};
				return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
			}
			
			//generate a new id
			var model = JSON.parse(xhr.requestBody);
			model.id = guidGenerator();
			
			xhr.respond(200, {"Content-Type": "application/json" }, JSON.stringify(model));
		});
		
		server.autoRespond = true;
		
		return {
			instance: server
		}
	})());
});