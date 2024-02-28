const express = require('express');
const cors = require('cors');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.url = '/api/sales';

        //Middlewares
        this.middlewares();
        //Rutas de mi app
        this.routes();
    }

    middlewares(){

        //Cors
        this.app.use( cors() );
        //Lectura y parseo del body
        this.app.use( express.json() );

    }

    routes(){
        
        this.app.use(this.url, require('../routes/tienda'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }


}

module.exports = Server;