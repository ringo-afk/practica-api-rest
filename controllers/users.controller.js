const { getConnection, sql } = require('../database/connection');
const crypto = require('crypto'); 


const hashPassword = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};

exports.getUsers = async (req, res) => {
    try {
        const pool = await getConnection();
        if (!pool) return res.status(500).json({ message: "Error: No hay conexion a la base de datos" });

        
        const result = await pool.request().query('SELECT username, role FROM Users'); 
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createUser = async (req, res) => {
    const { username, role, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Faltan credenciales (username o password)" });
    }

    try {
        
        const salt = crypto.randomBytes(16).toString('hex');
        
        
        const hashedPassword = hashPassword(password, salt);

        const pool = await getConnection();

        await pool.request()
            .input('username', sql.VarChar, username)
            .input('role', sql.VarChar, role || 'User')
            .input('password', sql.VarChar, hashedPassword)
            .input('salt', sql.VarChar, salt)
            .query('INSERT INTO Users (username, role, password, salt) VALUES (@username, @role, @password, @salt)');
        
        res.json({ message: "Usuario creado correctamente con contraseña segura" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Faltan credenciales" });
    }

    try {
        const pool = await getConnection();
        

        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE username = @username');

        const user = result.recordset[0];

        
        if (!user) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        
        const hashedAttempt = hashPassword(password, user.salt);

        if (hashedAttempt === user.password) {
            res.json({ 
                message: "Login exitoso", 
                user: { username: user.username, role: user.role } 
            });
        } else {
            res.status(401).json({ message: "Credenciales incorrectas" });
        }

    } catch (error) {
        res.status(500).send(error.message);
    }
};