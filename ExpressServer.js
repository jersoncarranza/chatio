var express = require('express'); 
var routes = require('./routes/index'); 
var app = this.expressServer;


var  ExpressServer = function  (config) {
	console.log("todo bein hq");
	config = config || {};
	this.expressServer = express();

	this.expressServer.set("view engine", "jade");
	this.expressServer.use(express.static("./public")); 
	this.expressServer.set('views', __dirname + '/public');
	this.expressServer.use('/', routes); 


};
module.exports = ExpressServer;