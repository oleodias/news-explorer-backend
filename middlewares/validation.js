const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

// O celebrate confere a requisição ANTES do controlador: um corpo errado
// nem chega a gastar CPU com o hash da senha ou a ir ao banco. O Joi recusa
// campos que não estão listados no esquema. Esta é a primeira barreira; a
// segunda são os esquemas do Mongoose, antes de gravar no banco.

// A mesma regra de link do modelo article (validator.isURL com http(s)://
// obrigatório): se o Joi aceitasse um link que o Mongoose recusa, o erro só
// apareceria depois, no banco. 'string.uri' é o código de erro de URL do Joi.
const validateUrl = (value, helpers) => {
  if (validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true })) {
    return value;
  }
  return helpers.error('string.uri');
};

// ObjectId do MongoDB: 24 caracteres hexadecimais.
const objectId = Joi.string().hex().length(24).required();

module.exports.validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Cabeçalhos das rotas protegidas: Authorization precisa existir e ter o
// formato "Bearer <token>". unknown(true) porque toda requisição traz
// outros cabeçalhos (host, user-agent...), que não interessam aqui. O
// tratador central responde 401 (e não 400) quando é este segmento que
// falha, porque é falta de autenticação.
module.exports.validateAuthHeader = celebrate({
  [Segments.HEADERS]: Joi.object()
    .keys({
      authorization: Joi.string().required().pattern(/^Bearer .+$/),
    })
    .unknown(true),
});

module.exports.validateArticle = celebrate({
  [Segments.BODY]: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateUrl),
    image: Joi.string().required().custom(validateUrl),
  }),
});

module.exports.validateArticleId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({ articleId: objectId }),
});
