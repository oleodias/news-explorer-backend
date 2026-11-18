const { isCelebrateError } = require('celebrate');
const { STATUS, MESSAGES } = require('../utils/constants');

// O tratador de erros central: TODO erro da API passa por aqui e sai no
// mesmo formato, { message }. O Express o reconhece pelos QUATRO
// parâmetros; o next fica na assinatura mesmo sem uso (a regra
// no-unused-vars do .eslintrc ignora o nome "next").
//
// Os controladores não montam respostas de erro: passam o erro com next(),
// e este módulo escolhe o status. Nenhum erro cru do banco ou do Node chega
// ao cliente: o que não é reconhecido vira 500 com mensagem genérica.
module.exports = (err, req, res, next) => {
  // Erros nossos (pasta errors/): já trazem o status e a mensagem.
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  // celebrate: a requisição não segue o esquema (middlewares/validation.js).
  // details é um Map por segmento (body, params, headers).
  if (isCelebrateError(err)) {
    // Cabeçalho Authorization ausente ou fora do formato "Bearer <token>":
    // é falta de autenticação, então 401, e não 400.
    if (err.details.has('headers')) {
      return res.status(STATUS.UNAUTHORIZED).send({ message: MESSAGES.AUTH_REQUIRED });
    }
    // Nos outros segmentos, a mensagem diz quais campos falharam.
    const fields = [...err.details.values()]
      .flatMap((joiError) => joiError.details.map((detail) => detail.path.join('.')));
    return res.status(STATUS.BAD_REQUEST).send({ message: `${MESSAGES.INVALID_DATA}: ${fields.join(', ')}` });
  }

  // CastError: um id malformado que passou pela validação.
  if (err.name === 'CastError') {
    return res.status(STATUS.BAD_REQUEST).send({ message: MESSAGES.INVALID_ID });
  }

  // ValidationError: dados que não passam no esquema do Mongoose (a
  // segunda barreira, antes de gravar no banco).
  if (err.name === 'ValidationError') {
    return res.status(STATUS.BAD_REQUEST).send({ message: MESSAGES.INVALID_DATA });
  }

  // 11000: o índice unique do e-mail recusou um cadastro repetido.
  if (err.code === 11000) {
    return res.status(STATUS.CONFLICT).send({ message: MESSAGES.EMAIL_TAKEN });
  }

  // Erros do próprio Express com status 400: JSON malformado no corpo,
  // endereço malformado (/articles/%E0).
  if (err.status === STATUS.BAD_REQUEST) {
    return res.status(STATUS.BAD_REQUEST).send({ message: MESSAGES.INVALID_DATA });
  }

  // Qualquer outra coisa: 500, sem expor os detalhes do erro.
  return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR });
};
