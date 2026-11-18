const { STATUS } = require('../utils/constants');

// 403: sabemos quem é, mas ele não tem o direito (excluir o artigo de outra pessoa)
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
