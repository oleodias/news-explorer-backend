// Configuração do app num lugar só. Em produção, os valores vêm do .env do
// servidor (NODE_ENV=production, MONGO_URL e JWT_SECRET); fora dele, valores
// fixos de desenvolvimento, para o projeto rodar sem .env.
//
// Por que comparar com 'production', e não com 'development': o Node não
// define NODE_ENV sozinho (sem o .env, ele é undefined). Qualquer valor que
// não seja 'production' cai nos valores de desenvolvimento.
//
// Quem usa a chave (o login, que assina o token, e o middleware auth, que
// confere) importa DAQUI. Se cada um escolhesse a chave por conta própria,
// uma diferença entre os dois faria todo token ser recusado com 401.
const {
  NODE_ENV,
  PORT = 3000,
  MONGO_URL,
  JWT_SECRET,
} = process.env;

const isProduction = NODE_ENV === 'production';

module.exports = {
  PORT,
  // 127.0.0.1 em vez de localhost: em algumas máquinas, "localhost" é
  // resolvido primeiro para o endereço IPv6 (::1), e o MongoDB, por padrão,
  // só escuta no IPv4.
  MONGO_URL: isProduction ? MONGO_URL : 'mongodb://127.0.0.1:27017/news-explorer',
  JWT_SECRET: isProduction ? JWT_SECRET : 'dev-secret',
  // O token vale 7 dias; depois disso, o usuário faz login de novo.
  JWT_EXPIRES_IN: '7d',
};
