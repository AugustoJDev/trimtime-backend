const express = require('express');
const router = express.Router();
const firebase = require('firebase/app');
require('firebase/firestore');

const { firebaseConfig } = require('../secrets/firebaseConfig');

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const db = firebase.firestore();

router.get('/api/prices', async (req, res) => {
    try {
            const pricesRef = db.collection('prices').doc('valores');
            const doc = await pricesRef.get();
    
            if (!doc.exists) {
                return res.status(404).send('Preços não encontrados');
            }
    
            const pricesData = doc.data();
            const pricesArray = Object.entries(pricesData).map(([key, value]) => ({ key, value }));

            res.json(pricesArray);
        } catch (error) {
            console.error('Erro ao obter preços:', error);
            res.status(500).send('Erro ao obter preços');
        }
});

module.exports = router;