require('dotenv').config();
const { getUser, addUser, verifyUser } = require('./consultas');
const { vrfData, vrfCredencial, vrfToken } = require('./middleware');
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');

app.listen(3000, console.log("SERVIDOR ENCENDIDO EN EL PUERTO 3000"));

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
    console.log(`Método: ${req.method}. Solicitud: ${req.url}`);
    next();
});

app.get('/usuarios', vrfToken, async (req, res) => {
    try {
        const { email } = req.data;
        const result = await getUser(email);
        res.json(result);
    } catch (error) {
        res.status(error.message || 500).send(error);
    }
})

app.post('/usuarios', vrfData, async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body;
        await addUser( email, password, rol, lenguage );
        res.status(201).send('Usuario creado exitosamente');
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error);
    }
})

app.post('/login', vrfCredencial, async (req, res) => {
    try {
        const { email, password } = req.body;
        await verifyUser(email, password);
        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        console.log('Token creado exitosamente')
        res.send(token);
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error);
    }
})