
const { getConnection, sql } = require('../database/connection');

exports.getUsers = async (req, res) => {
    try {
        const pool = await getConnection();
        if (!pool) return res.status(500).json({ message: "Error: No hay conexion a la base de datos" });

        const result = await pool.request().query('SELECT * FROM Users'); 
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createUser = async (req, res) => {
    const { username, role } = req.body;
    try {
        const pool = await getConnection();

        await pool.request()
            .input('username', sql.VarChar, username)
            .input('role', sql.VarChar, role)
            .query('INSERT INTO Users (username, role) VALUES (@username, @role)');
        
        res.json({ message: "Usuario creado correctamente en SSMS" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.login = (req, res) => {
    res.json({ message: "Ruta de login configurada" });
};