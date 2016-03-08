// **************  Importamos los módulos
var express = require('express');
var router = express.Router();

//**************  Carga de controladores
var webController = require('../controllers/web_controller');
//var menuController = require('../controllers/menu_controller');
//var adminController = require('../controllers/admin_controller');

// **************  Gestión de rutas index, contacto y acerca de
router.get("/", webController.index); 				// Index de la app

module.exports = router;