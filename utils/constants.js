// Códigos de status e mensagens em constantes: um número solto no meio do
// código não diz o que significa, e um erro de digitação numa mensagem
// repetida em vários arquivos passaria despercebido.
const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

const MESSAGES = {
  // 400
  INVALID_DATA: 'Dados inválidos',
  INVALID_ID: 'ID inválido',
  INVALID_EMAIL: 'O e-mail precisa ser válido',
  INVALID_URL: 'O link precisa ser válido',
  // 401
  AUTH_REQUIRED: 'Autorização necessária',
  WRONG_CREDENTIALS: 'E-mail ou senha incorretos',
  // 403
  FORBIDDEN_ARTICLE: 'Você não pode excluir o artigo de outro usuário',
  // 404
  USER_NOT_FOUND: 'Usuário não encontrado',
  ARTICLE_NOT_FOUND: 'Artigo não encontrado',
  ROUTE_NOT_FOUND: 'A solicitação não foi encontrada',
  // 409
  EMAIL_TAKEN: 'Este e-mail já está cadastrado',
  // 429
  TOO_MANY_REQUESTS: 'Muitas requisições. Tente novamente mais tarde',
  // 500
  SERVER_ERROR: 'Ocorreu um erro no servidor',
};

module.exports = { STATUS, MESSAGES };
