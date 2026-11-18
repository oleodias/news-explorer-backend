const router = require('express').Router();
const usersRouter = require('./users');
const articlesRouter = require('./articles');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateSignup, validateSignin, validateAuthHeader } = require('../middlewares/validation');
const NotFoundError = require('../errors/not-found-err');
const { MESSAGES } = require('../utils/constants');

// Todas as rotas num lugar só: o app.js usa só este roteador principal.

// 1) rotas públicas
router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);

// 2) daqui para baixo, só com um JWT válido: primeiro o formato do
// cabeçalho (celebrate), depois a assinatura do token (auth).
router.use(validateAuthHeader, auth);

router.use('/users', usersRouter);
router.use('/articles', articlesRouter);

// 3) nenhuma rota atendeu: vira um NotFoundError e segue para o tratador.
// Fica depois do auth de propósito: sem token, qualquer endereço responde
// 401, e quem não está logado não descobre quais rotas existem.
router.use((req, res, next) => {
  next(new NotFoundError(MESSAGES.ROUTE_NOT_FOUND));
});

module.exports = router;
