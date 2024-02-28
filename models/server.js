const express = require('express');
const cors = require('cors');
const uuidValidate = require('uuid-validate')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.url = '/api/sales';

        //Middlewares
        this.middlewares();
        //Rutas de mi app
        this.routes();
    }

    middlewares() {

        //Cors
        this.app.use(cors());
        //Lectura y parseo del body
        this.app.use(express.json());
        //Validar URL
        this.app.use(this.validarUrl.bind(this));

    }

    validarUrl(req, res, next) {
        const url = req.originalUrl;

        const urlBaseRegex = /^\/api\/sales\/.*$/;

        if (!url || !urlBaseRegex.test(url)) {
            return res.status(403).json({
                error: 'URL invalida!'
            });
        }

        const rutaBase = '/api/sales/';

        const rutaEspecifica = url.slice(rutaBase.length).split('/')[0];

        const rutasPermitidas = [
            'crearVenta',
            'actualizarVenta',
            'eliminarVenta',
            'listarVentas',
            'listarProductos',
            'crearProductos',
            'crearUsuario',
            'listarUsuario',
            'borrarUsuario',
            'asignarRol',
            'crearRol',
            'cierresDiarios',
            'cierresMensuales'
        ];

        if (!rutasPermitidas.includes(rutaEspecifica)) {
            return res.status(404).json({
                error: 'Ruta no encontrada!'
            });
        }

        const idRegex = /\/([a-f0-9-]+)$/;
        const idMatch = url.match(idRegex);

        if (idMatch) {
            const id = idMatch[1];
            if (!uuidValidate(id)) {
                return res.status(401).json({
                    error: 'El ID debe ser un UUID valido!'
                });
            }
        } else if (rutaEspecifica != 'listarProductos' && rutaEspecifica != 'listarVentas') {
            return res.status(401).json({
                error: 'Falta ingresar el ID en la ruta!'
            });
        }

        next();
    }

    routes() {
        this.app.use(this.url, require('../routes/tienda'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }


}

module.exports = Server;