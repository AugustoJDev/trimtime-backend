const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.options('*', cors());

// Middleware para parsing
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CORS funcionando!' });
});

const endpoints = require('./routes');
app.use(endpoints);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});