const { response, request } = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '12345',
    database: 'tienda'
})

const ventasPost = async (req, res = response) => {

    const { id } = req.params; 
    const { idProducto } = req.body;
    const price = await pool.query("SELECT price FROM products Where id = $1", [idProducto]);

    pool.query("INSERT INTO sales (products_id, qty, users_id) VALUES ($1, $2, $3)", [idProducto, price.rows[0].price, id], (error, result) => {
        if (error) {
            console.log(error.message);
            res.status(500).json({
                msg: "Ha ocurrido un problema con la base de datos!"
            });
        } else {
            if (result.rowCount > 0) {
                res.status(201).json({
                    msg: "Se ha realizado la compra exitosamente!"
                });
            } else {
                res.status(404).json({
                    msg: "No se encontraron ningun producto con ese ID o hace falta de este mismo"
                });
            }
        }
    });
}

const ventasPut = (req, res = response) => {

    res.json({
        msg: 'put API - controller'
    });
}

const ventasDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - controller'
    });
}

const ventasGet = async (req = request, res = response) => {
    const data = await pool.query('SELECT * FROM sales');
    res.status(200).json(data.rows);
}

module.exports = {
    ventasPost,
    ventasPut,
    ventasDelete,
    ventasGet
}