const { Router } = require('express');
const { ventasGet, ventasPut, ventasPost, ventasDelete, cierresDiariosGet, cierresMensualesGet } = require('../controllers/ventas');
const { productosGet, productosPost} = require('../controllers/productos');
const { usuariosGet, usuariosPost, usuariosPatch, usuariosDelete, rolPost } = require('../controllers/usuarios');

const router = Router();

//Routes de Ventas

router.post('/crearVenta/:id', ventasPost);
router.put('/actualizarVenta/:id', ventasPut);
router.delete('/eliminarVenta/:id', ventasDelete);
router.get('/listarVentas', ventasGet);

//Routes de Productos

router.get('/listarProductos', productosGet);
router.post('/crearProductos/:id', productosPost);

//Routes de Usuarios

router.post('/crearUsuario/:id', usuariosPost);
router.get('/listarUsuario/:id', usuariosGet);
router.delete('/borrarUsuario/:id', usuariosDelete);
router.patch('/asignarRol/:id', usuariosPatch);
router.post('/crearRol/:id', rolPost);

//Routes de Cierres diarios

router.get('/cierresDiarios/:id', cierresDiariosGet);

//Routes de balance mensual

router.get('/cierresMensuales/:id', cierresMensualesGet);

module.exports = router;