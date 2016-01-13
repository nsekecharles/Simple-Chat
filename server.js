var app = require('express')();

var http =require('http').Server(app);

var io = require('socket.io')(http);

var _ = require('underscore');

var userList = [];
app.get('/', function(req, res){
 // res.send('<h1>Hello world</h1>');
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected' + socket);
});

io.on('message', function(data){
  console.log('Msg sent' + data);
});

io.on('register', function(data) {
	userList.push(data);
  console.log('registering : ' + data);
});

io.sockets.on('connection', function (socket) {
  socket.on('register', function(data) {
		
		if(!_.contains(userList, data)) {

			console.log('registering : ' + data);
		
			userList.push(data);
		  	
			socket.emit('registerOK', true);
		}
	
	}).on('checkName', function(data) {
		console.log("list of names... " + userList);
	 	console.log("checkName... " + data);
	 	var nameUsed = _.contains(userList, data);
	 	socket.emit('nameUsed', nameUsed);
	 	
	});
});


http.listen(4490, function(){
  console.log('listening on *:4490');
});