// Lê o .env (só existe no servidor) para dentro de process.env. Precisa vir
// antes de qualquer require que use process.env.
// quiet: a partir da versão 17, o dotenv imprime uma linha a cada config().
require('dotenv').config({ quiet: true });

const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose
  .connect('mongodb://localhost:27017/news-explorer')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((error) => console.error('Não foi possível conectar ao MongoDB:', error.message));

// Transforma o corpo JSON das requisições em req.body.
app.use(express.json());

// No Express 5, se a porta já estiver ocupada, o erro chega como argumento
// deste callback. Sem o if, a mensagem de "listening" apareceria mesmo com o
// servidor fora do ar.
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`App listening at port ${PORT}`);
});
