const { STATUS } = require('../utils/constants');

// 401: não sabemos quem é (sem token, token inválido, e-mail ou senha errados)
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
