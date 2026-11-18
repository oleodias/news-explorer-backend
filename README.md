# NewsExplorer — back-end

API do NewsExplorer: cadastro e login de usuários e os artigos que cada um
salva. Feita com Node.js, Express e MongoDB para o Projeto Final do curso de
Desenvolvimento Web da TripleTen Brasil.

## 📅 Sprints

Projeto da Sprint 19 (Projeto Final), feito em etapas.

| Sprint | O que foi feito neste repositório |
| --- | --- |
| 19 — Etapa 2 | API completa: modelos, autenticação com JWT, validação, tratamento central de erros, logs, segurança e implantação |

O front-end (Etapas 1 e 3) fica no repositório
[news-explorer-frontend](https://github.com/oleodias/news-explorer-frontend).

## 🌐 Endereço

- API: **https://api.leonews.kaiak.top** (também responde por HTTP)

Hospedada numa VM do Google Cloud (Ubuntu 22.04), com MongoDB, PM2, Nginx
como proxy reverso e certificado HTTPS do Let's Encrypt. Teste rápido: sem
token, `https://api.leonews.kaiak.top/users/me` responde
`{"message":"Autorização necessária"}`.

## Rotas

| Método | Rota | Protegida | O que faz |
| --- | --- | --- | --- |
| `POST` | `/signup` | não | Cadastra (`email`, `password`, `name`) e devolve `_id`, `email` e `name` |
| `POST` | `/signin` | não | Confere `email` e `password` e devolve `{ token }` (JWT, vale 7 dias) |
| `GET` | `/users/me` | sim | Devolve o `email` e o `name` de quem está logado |
| `GET` | `/articles` | sim | Lista os artigos salvos por quem está logado |
| `POST` | `/articles` | sim | Salva um artigo (`keyword`, `title`, `text`, `date`, `source`, `link`, `image`) |
| `DELETE` | `/articles/:articleId` | sim | Exclui um artigo; só quem salvou pode excluir |

Rotas protegidas precisam do cabeçalho `Authorization: Bearer <token>`.

### Respostas de erro

Todas no formato `{ "message": "..." }`:

| Status | Quando |
| --- | --- |
| 400 | Dados inválidos (corpo, id ou JSON malformado) |
| 401 | Sem token, token inválido ou vencido, e-mail ou senha incorretos |
| 403 | Tentativa de excluir o artigo de outra pessoa |
| 404 | Artigo, usuário ou rota que não existe |
| 409 | E-mail já cadastrado |
| 429 | Mais de 100 requisições em 15 minutos pelo mesmo IP |
| 500 | Erro inesperado no servidor (sem detalhes internos) |

## Tecnologias

- Node.js, Express 5 e MongoDB com Mongoose
- bcryptjs (hash das senhas) e jsonwebtoken (JWT)
- celebrate/Joi e validator (validação antes do controller e no esquema)
- winston e express-winston (`request.log` e `error.log`)
- Helmet, CORS e express-rate-limit
- ESLint com a configuração airbnb-base

## Como rodar

Precisa do Node.js 20 ou mais novo e de um MongoDB rodando em
`127.0.0.1:27017`.

```bash
git clone https://github.com/oleodias/news-explorer-backend.git
cd news-explorer-backend
npm install
npm run dev     # com recarga automática (nodemon)
# ou
npm run start   # sem recarga
```

A API sobe em http://localhost:3000. Em desenvolvimento, não precisa de
`.env`: o endereço do banco e a chave do JWT têm valores padrão em
`utils/config.js`. Em produção, copie o `.env.example` para `.env` e
preencha os valores.

`npm run lint` (ou `npx eslint .`) confere o código.

## Estrutura

```
app.js            monta o app: segurança, logs, rotas e tratador de erros
routes/           index.js reúne users.js e articles.js
controllers/      a lógica de cada rota
models/           esquemas user e article (Mongoose)
middlewares/      auth, validação, limitador, logs e tratador de erros
errors/           classes de erro 400, 401, 403, 404 e 409
utils/            config.js (ambiente) e constants.js (status e mensagens)
```

## Autor

Leonardo Dias Caumo — [LinkedIn](https://www.linkedin.com/in/leonardodiascaumo) ·
[GitHub](https://github.com/oleodias)
