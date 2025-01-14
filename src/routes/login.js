const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const firebase = require('firebase/app');
require('firebase/firestore');

const secretKey = "trimtime-tokens"; // Chave secreta para gerar o token

const { firebaseConfig } = require('../secrets/firebaseConfig');

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
const db = firebase.firestore();

// Rota de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar o usuário no Firestore
    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(401).send('Credenciais inválidas');
    }

    const user = doc.data();

    if (user.password === password) {
      // Gerar um token JWT
      const token = jwt.sign(user, secretKey, { expiresIn: '24h' });

      return res.json({ token }); // Enviar a resposta e retornar
    } else {
      return res.status(401).send('Credenciais inválidas');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).send('Erro ao fazer login');
  }
});

module.exports = router;