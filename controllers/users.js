const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../utils/config');
const { STATUS, MESSAGES } = require('../utils/constants');

// Os controladores não montam respostas de erro: passam o erro com next(),
// e o tratador central (middlewares/error-handler.js) escolhe o status.

// POST /signup
module.exports.createUser = (req, res, next) => {
  // O celebrate já conferiu o corpo antes de chegar aqui.
  const { email, password, name } = req.body;

  // Guardamos o HASH, nunca a senha. O 10 é o custo: 2^10 rodadas. O salt
  // é gerado pelo bcrypt e fica dentro do próprio hash.
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    // O select: false do esquema vale para buscas, não para o create: o
    // documento devolvido aqui AINDA tem o hash. Por isso a resposta lista
    // os campos um a um, sem o password.
    .then((user) => res.status(STATUS.CREATED).send({
      _id: user._id,
      email: user.email,
      name: user.name,
    }))
    .catch(next); // e-mail repetido → erro 11000 → 409 no tratador central
};

// POST /signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // Só o _id no payload: é o que o middleware auth precisa, e o payload
      // pode ser lido por qualquer um (é assinado, não criptografado).
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      res.send({ token });
    })
    .catch(next); // UnauthorizedError (401) vindo do findUserByCredentials
};

// GET /users/me — o _id vem do token (req.user, preenchido pelo middleware
// auth), nunca da URL nem do corpo. Devolve só e-mail e nome, como pede o
// checklist.
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError(MESSAGES.USER_NOT_FOUND))
    .then((user) => res.send({ email: user.email, name: user.name }))
    .catch(next);
};
