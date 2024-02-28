const { response, request } = require('express');
const { Pool } = require('pg');

//Relacion base de datos

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '12345',
    database: 'tienda'
})

//Crear Usuarios

const usuariosPost = async (req, res = response) => {

    const idAdmin = req.params.id;
    const { document, last_name, name, roles_id } = req.body;

    const dataUser = await pool.query("SELECT roles_id FROM users Where id = $1", [idAdmin]);
    const data = await pool.query("SELECT id FROM roles WHERE name = 'admin'");

    if (dataUser.rows[0].roles_id == data.rows[0].id) {
        if ((document && last_name && name && roles_id) != null) {
            pool.query("INSERT INTO users (document, last_name, name, roles_id) VALUES ($1, $2, $3, $4)", [document, last_name, name, roles_id], (error, row) => {
                if (error) {
                    res.status(500).json({
                        msg: 'Ha ocurrido un problema con la base de datos, verifique que los datos ingresados sean los correctos!'
                    });
                } else {
                    res.status(201).json({
                        msg: `Se ha creado exitosamente el usuario: ${name}!`,
                    });
                }
            });
        } else {
            res.status(403).json({
                msg: 'No se ha podido realizar la accion, verifique si se han ingresado todos los datos del usuario!'
            });
        }
    } else {
        res.status(401).json({
            msg: 'Actualmente no cuentas con los permisos adecuados para esta tarea, por favor verificar con un admin!'
        });
    }
}

//Listar Usuarios

const usuariosGet = async (req = request, res = response) => {

    const idAdmin = req.params.id;

    const dataUser = await pool.query("SELECT roles_id FROM users Where id = $1", [idAdmin]);
    const data = await pool.query("SELECT id FROM roles WHERE name = 'admin'");

    if (dataUser.rows[0].roles_id == data.rows[0].id) {
        const data = await pool.query('SELECT * FROM users');

        res.status(200).json(data.rows);
    } else {
        res.status(401).json({
            msg: 'Actualmente no cuentas con los permisos adecuados para esta tarea, por favor verificar con un admin!'
        });
    }
}

//Borrar Usuarios

const usuariosDelete = async (req, res = response) => {
    const idAdmin = req.params.id;
    const { id, name, last_name, document } = req.body;

    const dataUser = await pool.query("SELECT roles_id FROM users Where id = $1", [idAdmin]);
    const data = await pool.query("SELECT id FROM roles WHERE name = 'admin'");

    if (dataUser.rows[0].roles_id == data.rows[0].id) {
        let query = "DELETE FROM users WHERE 1=1";
        let params = [];
        let contador = 1;

        if (id) {
            query += ` AND id = $${contador}`;
            params.push(id);
            contador++;
        }
        if (name) {
            query += ` AND name = $${contador}`;
            params.push(name);
            contador++;
        }
        if (last_name) {
            query += ` AND last_name = $${contador}`;
            params.push(last_name);
            contador++;
        }
        if (document) {
            query += ` AND document = $${contador}`;
            params.push(document);
            contador++;
        }

        pool.query(query, params, (error, result) => {
            if (error) {
                res.status(500).json({
                    msg: "Ha ocurrido un problema con la base de datos, verifique que los datos ingresados sean los correctos!"
                });
            } else {
                if (result.rowCount > 0) {
                    res.status(200).json({
                        msg: "Se ha borrado exitosamente los datos del usuario!"
                    });
                } else {
                    res.status(404).json({
                        msg: "No se encontraron usuarios que cumplan con los criterios de búsqueda!"
                    });
                }
            }
        });
    } else {
        res.status(401).json({
            msg: 'Actualmente no cuentas con los permisos adecuados para esta tarea, por favor verificar con un admin!'
        });
    }
}

//Asignar Un Rol A Un Usuario

const usuariosPatch = async (req = request, res = response) => {

    const idAdmin = req.params.id;
    const { id, roles_id } = req.body;

    const dataUser = await pool.query("SELECT roles_id FROM users Where id = $1", [idAdmin]);
    const data = await pool.query("SELECT id FROM roles WHERE name = 'admin'");

    if (dataUser.rows[0].roles_id == data.rows[0].id) {
        if (roles_id != null) {
            pool.query("UPDATE users SET roles_id = $1 WHERE id = $2", [roles_id, id], (error, result) => {
                if (error) {
                    res.status(500).json({
                        msg: "Ha ocurrido un problema con la base de datos, verifique que los datos ingresados sean los correctos!"
                    });
                } else {
                    if (result.rowCount > 0) {
                        res.status(200).json({
                            msg: "Se ha actualizado exitosamente el rol del usuario!"
                        });
                    } else {
                        res.status(404).json({
                            msg: "No se encontro ningún usuario con el ID proporcionado o no se ha proporcionado los datos requeridos!"
                        });
                    }
                }
            });
        } else {
            res.status(404).json({
                msg: "No se ha ingresado ningun rol para realizar el cambio con algun usuario!"
            });
        }

    } else {
        res.status(401).json({
            msg: 'Actualmente no cuentas con los permisos adecuados para esta tarea, por favor verificar con un admin'
        });
    }
}

//Crear Roles

const rolPost = async (req, res = response) => {

    const idAdmin = req.params.id;
    const { name } = req.body;

    const dataUser = await pool.query("SELECT roles_id FROM users Where id = $1", [idAdmin]);
    const data = await pool.query("SELECT id FROM roles WHERE name = 'admin'");

    if (dataUser.rows[0].roles_id == data.rows[0].id) {
        if ((name) != null) {
            pool.query("INSERT INTO roles ( name ) VALUES ( $1 )", [ name ], (error, row) => {
                if (error) {
                    res.status(500).json({
                        msg: 'Ha ocurrido un problema con la base de datos, verifique que los datos ingresados sean los correctos!'
                    });
                } else {
                    res.status(201).json({
                        msg: `Se ha creado exitosamente el rol: ${name}!`,
                    });
                }
            });
        } else {
            res.status(403).json({
                msg: 'No se ha podido realizar la accion, verifique si se han ingresado todos los datos requeridos!'
            });
        }
    } else {
        res.status(401).json({
            msg: 'Actualmente no cuentas con los permisos adecuados para esta tarea, por favor verificar con un admin!'
        });
    }
}

//Exportacion de elementos

module.exports = {
    usuariosPost,
    usuariosGet,
    usuariosDelete,
    usuariosPatch,
    rolPost
}