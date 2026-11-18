// Lê o .env (só existe no servidor) para dentro de process.env. Precisa vir
// antes de qualquer require que use process.env, como o utils/config.js.
// quiet: a partir da versão 17, o dotenv imprime uma linha a cada config().
require('dotenv').config({ quiet: true });

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { PORT, MONGO_URL } = require('./utils/config');
const routes = require('./routes');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');

const app = express();

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((error) => console.error('Não foi possível conectar ao MongoDB:', error.message));

// No servidor, o Nginx recebe a requisição e a repassa ao Node: para o
// Express, todas viriam do 127.0.0.1, e o limitador contaria o mundo
// inteiro como um único IP. Com trust proxy = 1, o Express confia no
// primeiro proxy (o Nginx) e lê o IP real do cabeçalho X-Forwarded-For.
app.set('trust proxy', 1);

// 1) Helmet: cabeçalhos de segurança em todas as respostas (impede que a
// API seja aberta dentro de um iframe, desliga a adivinhação de tipo de
// arquivo, esconde o "X-Powered-By: Express"...).
app.use(helmet());

// 2) CORS: o front-end fica em outro domínio, e o navegador só deixa ele
// ler as respostas da API com os cabeçalhos do CORS. O cors() também
// responde ao OPTIONS (preflight) que o navegador manda antes de toda
// requisição com JSON ou com Authorization.
app.use(cors());

// 3) O logger de requisições vem antes do limitador e das rotas, para
// registrar também as requisições recusadas.
app.use(requestLogger);

// 4) Limitador de taxa, antes das rotas.
app.use(limiter);

// Transforma o corpo JSON das requisições em req.body.
app.use(express.json());

// 5) Todas as rotas da API (routes/index.js).
app.use(routes);

// 6) O logger de erros vem depois das rotas e antes do tratador.
app.use(errorLogger);

// 7) O tratador central vem DEPOIS de tudo: o Express só chega a ele
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
