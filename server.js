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

  console.log('a user connected: ' + socket.id);

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
		
		if(!_.find(userList,function(user){ return user.name === data; })) {

			console.log('registering : ' + data);
		
			userList.push({socketId : socket.id, name : data});
		  	
			socket.emit('registerOK', true);
		}
	
	}).on('checkName', function(data) {
		
		console.log("list of names... " + userList);
	 	
	 	console.log("checkName... " + data);

	 	var nameUsed = _.find(userList,function(user){ return user.name === data; }) !== undefined;

	 	socket.emit('nameUsed', nameUsed);
	 	
	}).on('sendMsg', function(data) {
		
		if(data.to == 'all') {
			
			console.log(data);

			io.emit('newMsg', {
				
				from:
					_.find(userList,function(user){ 
					
					return user.socketId === socket.id; 
				
					}).name, 
				message: data.message});
		
		}
	});
});


http.listen(4490, function(){
  console.log('listening on *:4490');
});