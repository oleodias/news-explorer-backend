const { STATUS } = require('../utils/constants');

// 409: o e-mail do cadastro já existe
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS.CONFLICT;
  }
}

module.exports = ConflictError;
