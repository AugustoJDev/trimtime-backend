const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Configuração do CORS
app.use(cors({
    origin: '*', // Domínio do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],    // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

// Middleware para parsing
app.use(express.json());

// Teste de rota básica
app.get('/', (req, res) => {
    res.json({ message: 'CORS funcionando!' });
});

// Rotas do aplicativo
const endpoints = require('./routes');
app.use(endpoints);

// Inicialização do servidor
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
