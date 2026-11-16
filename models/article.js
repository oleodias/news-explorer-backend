const mongoose = require('mongoose');
const validator = require('validator');
const { MESSAGES } = require('../utils/constants');

// Os campos são os que o front-end já monta a partir da News API
// (normalizeArticle, em src/utils/NewsApi.js do front): keyword, title,
// text, date, source, link e image.
const urlField = {
  type: String,
  required: true,
  validate: {
    // validator.isURL em vez de uma regex própria: os links das notícias
    // trazem acentos, %, parâmetros e outros caracteres que uma regex curta
    // recusaria.
    validator: (value) => validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true }),
    message: MESSAGES.INVALID_URL,
  },
};

const articleSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  // String, e não Date: o front-end guarda a data como a API entrega
  // ("2026-11-10T14:03:00Z") e só formata na hora de mostrar.
  date: { type: String, required: true },
  source: { type: String, required: true },
  link: urlField,
  image: urlField,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    // select: false — a lista de artigos não mostra de quem é cada um. A
    // exclusão vai pedir com .select('+owner') para conferir o dono.
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
