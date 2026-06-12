const jwt = require('jsonwebtoken');

// Verifica que el token JWT sea válido antes de permitir acceso a la ruta
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer <token>

    if (!token) return res.status(401).json({ ok: false, message: 'Token requerido' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Guarda los datos del usuario en la request
        next();
    } catch (error) {
        res.status(403).json({ ok: false, message: 'Token inválido o expirado' });
    }
};

// Verifica que el usuario tenga el rol requerido
const verificarRol = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({ ok: false, message: 'No tenés permisos para esta acción' });
        }
        next();
    };
};

module.exports = { verificarToken, verificarRol };