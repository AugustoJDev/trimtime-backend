const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors({
  origin: 'https://trimtime-frontend.pages.dev',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const endpoints = require('./routes');
app.use(endpoints);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});