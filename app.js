// Lê o .env (só existe no servidor) para dentro de process.env. Precisa vir
// antes de qualquer require que use process.env, como o utils/config.js.
// quiet: a partir da versão 17, o dotenv imprime uma linha a cada config().
require('dotenv').config({ quiet: true });

const express = require('express');
const mongoose = require('mongoose');
const { PORT, MONGO_URL } = require('./utils/config');
const routes = require('./routes');
const errorHandler = require('./middlewares/error-handler');

const app = express();

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((error) => console.error('Não foi possível conectar ao MongoDB:', error.message));

// Transforma o corpo JSON das requisições em req.body.
app.use(express.json());

// Todas as rotas da API (routes/index.js).
app.use(routes);

// O tratador central vem DEPOIS de todas as rotas: o Express só chega a ele
// quando alguém chama next(erro) ou quando um erro é lançado.
app.use(errorHandler);

// No Express 5, se a porta já estiver ocupada, o erro chega como argumento
// deste callback. Sem o if, a mensagem de "listening" apareceria mesmo com o
// servidor fora do ar.
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`App listening at port ${PORT}`);
});
