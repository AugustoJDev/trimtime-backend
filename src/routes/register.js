const express = require('express');
const router = express.Router();
const firebase = require('firebase/app');
const jwt = require('jsonwebtoken');

require('firebase/firestore');
require('dotenv').config();

const { firebaseConfig } = require('../secrets/firebaseConfig');

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const db = firebase.firestore();

router.post('/register', async (req, res) => {
  const { name, email, password, number } = req.body;

  try {
    const userRef = db.collection('users').doc(email);
    await userRef.set({
      name,
      email,
      password,
      number
    });

    const userQuery = await db.collection('users').where('email', '==', email).get();
    const userDoc = userQuery.docs[0];

    const token = jwt.sign({ id: userDoc.id, email: email }, process.env.JWT, { expiresIn: '24h' });

    res.status(201).json({ name, email, number, token });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).send('Erro ao registrar usuário');
  }
});

module.exports = router;