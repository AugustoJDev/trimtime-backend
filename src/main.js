const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

const endpoints = require('./routes');
app.use(endpoints);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});