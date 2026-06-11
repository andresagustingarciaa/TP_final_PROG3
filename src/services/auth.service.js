const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Busca el usuario por email y verifica la contraseña
const login = async (email, contrasenia) => {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE email = ? AND activo = 1',
        [email]
    );
    if (rows.length === 0) return null;

    const usuario = rows[0];

    // Compara la contraseña ingresada con la guardada (encriptada)
    const passwordValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!passwordValida) return null;

    // Genera el token JWT con el id, email y rol del usuario
    const token = jwt.sign(
        { id: usuario.id_usuario, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    return { token, rol: usuario.rol };
};

module.exports = { login };