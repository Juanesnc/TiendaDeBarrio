const { response, request } = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '12345',
    database: 'tienda'
})

const productosGet = async (req = request, res = response) => {
    const data = await pool.query('SELECT * FROM products');
    res.status(200).json(data.rows);
}

const productosPost = async (req = request, res = response) => {

    const  id = req.params.id;
    const { description, name, price } = req.body;
    const dataUser = await pool.query("SELECT roles_id FROM users Where id = $1", [id]);
    const data = await pool.query("SELECT id FROM roles WHERE name = 'admin'");

    if(dataUser.rows[0].roles_id == data.rows[0].id){
        if( (description && name && price) != null){
            pool.query(`INSERT INTO products (description, name, price) VALUES ('${description}' ,'${name}', ${price})`, (error, row) => {
                if (error) {
                    res.status(500).json({
                        msg: 'Ha ocurrido un problema con la base de datos!'
                    });
                } else {
                    res.status(201).json({
                        msg: `Se ha creado el producto: ${name} exitosamente`,
                    });
                }
            });
        }else{
            res.status(403).json({
                msg: 'No se ha podido realizar la accion, verifique si se han ingresado todos los datos del producto'
            });
        }
    }else{
        res.status(401).json({
            msg: 'Actualmente no cuentas con los permisos adecuados para esta tarea, por favor verificar con un admin'
        });
    }
    
}

module.exports = {
    productosGet,
    productosPost
}