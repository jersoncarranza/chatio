// **************  Zona de importación de paquetes
var express = require('express'); 				// App Express
//var bodyParser = require('body-parser');		// Módulo para acceder a datos de los post
//var multer = require('multer'); 				// Módulo para cargar imágenes temporales
var routes = require('./routes/index'); 		// Rutas
//var method_override = require('method-override'); // Módulo para sobreescribir rutas
var http = require('http');
// **************  Generamos la aplicación

var  ExpressServer = function  (config) {
	config = config || {};
	this.expressServer = express();

	this.expressServer.set("view engine", "html");
	//this.expressServer.use(bodyParser.json());
	//this.expressServer.use(bodyParser.urlencoded({extended:true}));  // Por defecto es true
	//this.expressServer.use(multer({dest: "./uploads"}).single('image_item'));
	this.expressServer.use(express.static("./public")); 			// Carpeta que contendrá los archivos estáticos
	//this.expressServer.use(method_override("_method")); 		// Variable que se usará para redefinir métodos
	this.expressServer.use('/', routes);  

	app.get('/', function (req, res) {
  res.send('Hello World')
})

};

module.exports = ExpressServer;