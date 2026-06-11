const authService = require('../services/auth.service');

// Inicia sesión y devuelve un token JWT
const login = async (req, res) => {
    try {
        const { email, contrasenia } = req.body;
        const result = await authService.login(email, contrasenia);
        if (!result) return res.status(401).json({ ok: false, message: 'Email o contraseña incorrectos' });
        res.status(200).json({ ok: true, data: result });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

module.exports = { login };