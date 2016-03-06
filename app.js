var express = require('express');
var app = express();

var server = require('http').createServer(app);
var	io= require('socket.io').listen(server); 
var users = {};
//var nicknames =[];

app.set("view engine", "jade");
app.use(express.static("./public")); 
app.set('views', __dirname + '/public');

app.get('/', function (req, res) {
  res.render('index');
});

io.sockets.on('connection', function (socket) {

	socket.on('newuser', function (data, callback) {
		console.log("el nuevo usuario", data);
		//if(nicknames.indexOf(data) != -1){
		if(data in users){
			callback(false);
		}
		else{
			callback(true);
			socket.nickname  = data;
			users[socket.nickname] = socket;
			//nicknames.push(socket.nickname);
			//io.sockets.emit('usernames', nicknames);
			updateNicknames();
		}
	});

	socket.on('send message', function (data, callback) {
		console.log("el message es:", data);
		var msg = data.trim();
		if(msg.substr(0,3) === '/w ')
		{
			msg = msg.substr(3);
			var ind = msg.indexOf(' ');
			if (ind !== -1) {
				var name = msg.substring(0, ind);
				var msg = msg.substring(ind + 1);
				if(name in users){
					users[name].emit('whisper',{ msg: data , nick: socket.nickname });
					console.log("whisper");
				}else{
					console.log("Error el mensaje no se envio");
					callback('Error: enter a valid user');
				}
			}else{
				callback.log('Error: Please enter a message for your whisper');
			}
		}else{
		io.sockets.emit('new message',{ msg: msg , nick: socket.nickname });
		//socket.broadcast.emit('new message', data);
		}

	});

	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		delete users[socket.nickname];
		//nicknames.splice(nicknames.indexOf(socket.nickname),1);
		updateNicknames();
	});

	function updateNicknames () {
		//io.sockets.emit('usernames', nicknames);
		io.sockets.emit('usernames', Object.keys(users));
	};

});

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
var port = normalizePort(process.env.PORT || 5000);
server.listen(port);
console.log('Puerto:', port);