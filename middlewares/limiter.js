const { rateLimit } = require('express-rate-limit');
const { STATUS, MESSAGES } = require('../utils/constants');

// Limitador de taxa: cada endereço IP pode fazer até 100 requisições a cada
// 15 minutos. Protege o login de quem tenta adivinhar senhas em sequência e
// o servidor de quem dispara milhares de requisições.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos, em milissegundos
  limit: 100,
  // Cabeçalhos RateLimit-* no padrão atual, para o cliente saber quanto
  // ainda pode pedir; os antigos (X-RateLimit-*) ficam desligados.
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  // A resposta segue o mesmo formato dos outros erros da API: { message }.
  handler: (req, res) => {
    res.status(STATUS.TOO_MANY_REQUESTS).send({ message: MESSAGES.TOO_MANY_REQUESTS });
  },
});
