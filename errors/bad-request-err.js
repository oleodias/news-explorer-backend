const { STATUS } = require('../utils/constants');

// 400: os dados enviados não servem (corpo, parâmetro ou id malformado)
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
