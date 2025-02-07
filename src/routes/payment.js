const { MercadoPagoConfig, Payment } = require("mercadopago");
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { firebaseConfig } = require('../secrets/firebaseConfig');
const firebase = require('firebase/app');

require('firebase/firestore');
require('dotenv').config();

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
else {
    firebase.app();
}

const db = firebase.firestore();

router.post('/payment', async (req, res) => {
    const body = req.body;

    const { payId, token, email, price, items } = {
        payId: body.payment_method_id,
        token: body.token,
        email: body.payer.email,
        price: body.transaction_amount,
        items: body.items,
    }

    const decoded = jwt.verify(token, process.env.JWT);

    try {
        const userRef = db.collection('users').doc(decoded.email);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(404).send('Usuário não encontrado');
        }

        const mp = new MercadoPagoConfig({ accessToken: process.env["mercadopago-key"], options: { timeout: 5000, idempotencyKey: token } });

        const payment = new Payment(mp);
        
        const transaction = {
            transaction_amount: price,
            description: `Compra de ${items.length} itens, sendo eles: ${items.map(item => item.title).join(', ')}`,
            payment_method_id: payId,
            payer: {
                email: email
            },
        };

        payment.create({ body: transaction })
        .then((data) => {
            console.log(data);
            return res.json(data);
        })
        .catch(console.log);
    } catch (error) {
        console.error('Erro ao fazer pagamento:', error);
        return res.status(500).send('Erro ao fazer pagamento');
    }
});

module.exports = router;