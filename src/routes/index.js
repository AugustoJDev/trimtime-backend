const express = require('express');
const router = express.Router();

// Importar rotas
const loginRoute = require('./login');
const registerRoute = require('./register');
const pricesRoute = require('./prices');
const paymentRoute = require('./payment')
const bookingRoute = require('./booking');

// Usar rotas
router.use(loginRoute);
router.use(registerRoute);
router.use(pricesRoute);
router.use(paymentRoute);
router.use(bookingRoute);

module.exports = router;