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
								"weight":0,\
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
								"weight":0,\
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
								"weight":0,\
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
								"weight":0,\
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
								"weight":0,\
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
								"weight":0,\
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
								"weight":0,\
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
								"weight":0,\
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
								"weight":0,\
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
								"weight":0,\
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
								"weight":0,\
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
								"weight":0,\
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
								"weight":0,\
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
								"content":"Browsers",\
								"weight":0,\
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
								"id":"c0176d62-732f-d0b7-1a57-91e017177342"\
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
								"weight":0,\
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
		
		answers = {"7bd1255f-6efe-983a-6918-52b213d8d176": answersFor1, "7bd1255f-6efe-983a-6918-91e017177342": answersFor2};
						
	
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