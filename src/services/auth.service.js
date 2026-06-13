const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Genera hash SHA256 de una contraseña
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Busca el usuario por email y verifica la contraseña
const login = async (email, contrasenia) => {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE email = ? AND activo = 1',
        [email]
    );
    if (rows.length === 0) return null;

    const usuario = rows[0];

    // Intenta validar con bcrypt (nuevos usuarios) y SHA256 (usuarios existentes)
    let passwordValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    
    // Si bcrypt no funciona, intenta con SHA256 (usuarios existentes)
    if (!passwordValida) {
        const contraseniaHash = hashPassword(contrasenia);
        passwordValida = contraseniaHash === usuario.contrasenia;
    }
    
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