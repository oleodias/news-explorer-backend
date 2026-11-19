const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { JWT_SECRET } = require('../utils/config');
const { MESSAGES } = require('../utils/constants');

// Confere o JWT de toda requisição às rotas protegidas. O formato do
// cabeçalho ("Bearer <token>") já foi conferido pelo validateAuthHeader;
// aqui se confere a ASSINATURA. Token válido → req.user = payload
// ({ _id, iat, exp }) e a requisição segue; senão, 401.
module.exports = (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  let payload; // fora do try: let tem escopo de bloco

  try {
    // Lança se a assinatura não bate (JsonWebTokenError) ou se o token
    // venceu (TokenExpiredError): os dois casos são 401.
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // return: sem ele, a função seguiria e chamaria next() uma segunda vez.
    return next(new UnauthorizedError(MESSAGES.AUTH_REQUIRED));
  }

  req.user = payload;
  return next();
};
