const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const firebase = require('firebase/app');

require('firebase/firestore');
require('dotenv').config();

const { firebaseConfig } = require('../secrets/firebaseConfig');

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Se já estiver inicializado, use a instância existente
}
const db = firebase.firestore();

// Rota de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validação dos campos de entrada
  if (!email || !password) {
    return res.status(400).send('Email e senha são obrigatórios');
  }

  try {
    // Consulta o usuário pelo campo "email"
    const userQuery = await db.collection('users').where('email', '==', email).get();

    // Verifica se o usuário foi encontrado
    if (userQuery.empty) {
      return res.status(401).send('Credenciais inválidas');
    }

    // Pega o primeiro documento da query (já que emails devem ser únicos)
    const userDoc = userQuery.docs[0];
    const user = userDoc.data();

    // Verifica a senha (certifique-se de que o campo está corretamente nomeado no Firestore)
    if (user.password === password) { // Substitua "password" pelo nome correto do campo, se necessário
      // Gera um token JWT
      const token = jwt.sign({ id: userDoc.id, email: user.email }, process.env.JWT, { expiresIn: '24h' });

      // Retorna o token para o frontend
      return res.json({ token, user });
    } else {
      return res.status(401).send('Credenciais inválidas');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);

    // Tratamento de erros específicos do Firestore
    if (error.code === 'unavailable') {
      return res.status(500).send('Erro de conexão com o banco de dados');
    }

    // Erro genérico
    return res.status(500).send('Erro ao fazer login');
  }
});

module.exports = router;