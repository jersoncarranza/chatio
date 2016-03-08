var http  = require('http');
var expressServer = require('./ExpressServer.js');
var socketIO= require('./app/socketio.js');

//var	io= require('socket.io').listen(server); 
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }
  return false;
}

var app = new expressServer();
var server = http.createServer(app.expressServer);
var Io = new socketIO({server:server});

var port = normalizePort(process.env.PORT || 5000);
server.listen(port);
console.log('Escuchando Puerto N0:', port);