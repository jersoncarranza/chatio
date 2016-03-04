/*
var http  = require('http');
var expressServer = require('./ExpressServer0.js');


var app = new expressServer();
var server = http.createServer(app.expressServer);
var port = normalizePort(process.env.PORT || 5000)
server.listen(port);
console.log('escuchando el puerto', port);
*/

//app.engine('html', swig.renderFile);
/*app.set('view options', {
  layout: false
});*/
var express = require('express');
var app = express();

var server = require('http').createServer(app);
var	io= require('socket.io').listen(server); 
var nicknames =[];

app.set("view engine", "jade");
app.use(express.static("./public")); 
app.set('views', __dirname + '/public');

app.get('/', function (req, res) {
  res.render('index');
});

io.sockets.on('connection', function (socket) {

	socket.on('newuser', function (data, callback) {
		console.log("el nuevo usuario", data);
		if(nicknames.indexOf(data) != -1){
			callback(false);
		}else{
			callback(true);
			socket.nickname  = data;
			nicknames.push(socket.nickname);
			//io.sockets.emit('usernames', nicknames);
			updateNicknames();
		}
	});

	socket.on('send message', function (data) {
		console.log("el message es:", data);
		io.sockets.emit('new message',{ msg: data , nick: socket.nickname });
		//socket.broadcast.emit('new message', data);
	});

	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname),1);
		updateNicknames();
	});

	function updateNicknames () {
		io.sockets.emit('usernames', nicknames);
	};

});

server.listen(3000);
//app.listen(3000);
console.log('hola');