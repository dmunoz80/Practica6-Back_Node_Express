require('dotenv').config();
const jwt = require('jsonwebtoken');

const vrfData = (req, res, next) => {
    const { email, password, rol, lenguage } = req.body;
    if (!email || !password || !rol || !lenguage) {
        console.log('Todos los datos son obligatorios')
        return res.status(400).json({ mensaje: 'Todos los datos son obligatorios' });
    }
    console.log('Ingreso de datos OK');
    next();
}

const vrfCredencial = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log('email y password son obligatorios')
        return res.status(400).json({ mensaje: 'email y password son obligatorios' });
    }
    console.log('Credenciales OK');
    next();
}

const vrfToken = (req, res, next) => {
    try {
        const Authorization = req.header('Authorization');
        if(!Authorization) {
            return res.status(401).json({ mensaje: 'Token no existe' });
        }
        const token = Authorization.split("Bearer ")[1];
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        req.data = verifyToken;
        console.log('Token OK');
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token No Válido' });
    }
}

module.exports = {
    vrfData,
    vrfCredencial,
    vrfToken
}