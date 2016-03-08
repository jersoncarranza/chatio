var Io = require('socket.io');
var users = {};


var SocketIO = function(config){
	config = config || {};
	var io = Io.listen(config.server);
	console.log("socket.io");
	//vamos crear un canal

	io.sockets.on('connection', function (socket){

		socket.emit('mejorando.la', {hola:'soy el servidor'});

		socket.on('newuser', function (data, callback) {
		console.log("el nuevo usuario", data);
		
		if(data in users){
			callback(false);
		}
		else{
			callback(true);
			socket.nickname  = data;
			users[socket.nickname] = socket;
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
			}
		});

		socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		delete users[socket.nickname];
		//nicknames.splice(nicknames.indexOf(socket.nickname),1);
		updateNicknames();
		});

		function updateNicknames () {
		io.sockets.emit('usernames', Object.keys(users));
		};

	
	});
}
module.exports = SocketIO;