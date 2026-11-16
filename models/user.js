const mongoose = require('mongoose');
const validator = require('validator');
const { MESSAGES } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    // unique NÃO é um validador: é um índice no banco. O e-mail repetido não
    // é barrado pelo Mongoose, e sim pelo MongoDB, com o erro de código 11000
    // (o tratador central vai transformá-lo em 409).
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: MESSAGES.INVALID_EMAIL,
    },
  },
  password: {
    type: String,
    required: true,
    // select: false — as buscas não trazem o hash. Só o login vai pedir, com
    // .select('+password'). Atenção: isso vale para BUSCAS; o documento
    // devolvido pelo create() ainda tem o hash, então o cadastro precisa
    // escolher os campos da resposta.
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// 'user' no singular: o Mongoose cria a coleção "users".
module.exports = mongoose.model('user', userSchema);
