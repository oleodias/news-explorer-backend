const { STATUS } = require('../utils/constants');

// 404: o usuário, o artigo ou o endereço não existem
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS.NOT_FOUND;
  }
}

module.exports = NotFoundError;
