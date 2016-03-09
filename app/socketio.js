var Io = require('socket.io');
var users = {};

var mongoose= require('mongoose');

mongoose.connect('mongodb://la:l@ds064628.mlab.com:64628/chatio', function (err) {
	if (err) {
		console.log(err);
	}else{
		console.log('succefull conectada');
	}
});

var chatSchema = mongoose.Schema({
	//name:(first:String , last: String),
	nick:String,
	msg:String,
	created: {type:Date, default:Date.now}
});

var Chat = mongoose.model('Message', chatSchema);


var SocketIO = function(config){
	config = config || {};
	var io = Io.listen(config.server);
	console.log("socket.io");

	io.sockets.on('connection', function (socket){

		var query = Chat.find({});
		query.sort('-created').limit(8).exec(function(err, docs){
			if(err) throw err;
			console.log('Enviando mensaje viejos!');
			socket.emit('load', docs);
		});

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
			var newMsg =  new Chat({ msg: msg , nick:socket.nickname});
			newMsg.save(function (err){
				if (err) throw err;
				io.sockets.emit('new message',{ msg: msg , nick: socket.nickname });
				});
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