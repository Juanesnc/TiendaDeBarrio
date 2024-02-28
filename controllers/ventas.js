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
                    msg: "No se encontraron ningun producto con ese ID o hace falta de este mismo!"
                });
            }
        }
    });
}

const ventasPut = async (req, res = response) => {
    
    const idAdmin = req.params.id;
    const { idSale, idProduct, qty, users_id } = req.body;
    const dataUser = await pool.query("SELECT roles_id FROM users Where id = $1", [idAdmin]);
    const data = await pool.query("SELECT id FROM roles WHERE name = 'admin'");

    if (dataUser.rows[0].roles_id == data.rows[0].id) {
        if (idProduct != null) {
            if(users_id == null){
                users_id = idAdmin;
            }
            pool.query("UPDATE sales SET (products_id, qty, users_id) = ($1, $2, $3) WHERE id = $4", [idProduct, qty, users_id, idSale], (error, result) => {
                if (error) {
                    res.status(500).json({
                        msg: "Ha ocurrido un problema con la base de datos!"
                    });
                } else {
                    if (result.rowCount > 0) {
                        res.status(200).json({
                            msg: "Se ha actualizado exitosamente la venta!"
                        });
                    } else {
                        res.status(404).json({
                            msg: "No se encontro ninguna venta con el ID ingresado o hace falta informacion para la busqueda!"
                        });
                    }
                }
            });
        } else {
            res.status(404).json({
                msg: "No se ha ingresado ningun producto para poder realizar un cambio!"
            });
        }

    } else {
        res.status(401).json({
            msg: 'Actualmente no cuentas con los permisos adecuados para esta tarea, por favor verificar con un admin!'
        });
    }
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