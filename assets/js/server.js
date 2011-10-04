define(
[
	'libs/sinon/pkg/sinon-1.2.0'
],
function() {
	var app = window.APP;
	app.namespace('server');
	
	_.extend(app.server, (function() {
		var server = sinon.fakeServer.create();
		
		var questions = '[\
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
		
		answersFor1 = '[\
							{\
								"content":"Kittens",\
								"image":"http://placekitten.com/200/300",\
								"weight":0,"usertype":"developer",\
								"created":"2011-10-04T16:12:53.228Z",\
								"language":"en-US",\
								"id":"44cc74df-1e8e-0abb-fc8e-a45a50130d1d"\
							},\
							{\
								"content":"Foxes on Fire!!",\
								"image":"http://placekitten.com/200/300",\
								"weight":0,\
								"usertype":"designer",\
								"created":"2011-10-04T16:13:02.284Z",\
								"language":"en-US",\
								"id":"c0176d62-782f-d0b7-1a57-91e017177342"\
							}\
						]',
						
		answersFor2 = '[\
							{\
								"content":"Moar Lulz!",\
								"image":"http://placekitten.com/200/300",\
								"weight":0,\
								"usertype":"developer",\
								"created":"2011-10-04T16:13:12.492Z",\
								"language":"en-US",\
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
		
		server.autoRespond = true;
		
		return {
			instance: server
		}
	})());
});