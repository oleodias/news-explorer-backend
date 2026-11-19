const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const { STATUS, MESSAGES } = require('../utils/constants');

// O documento sem o campo owner. O select: false do esquema vale para
// buscas, mas o create() e o findById().select('+owner') devolvem o
// documento com o dono; a resposta segue o mesmo formato da lista.
const withoutOwner = (article) => {
  const data = article.toObject();
  delete data.owner;
  return data;
};

// GET /articles — só os artigos de quem está logado.
module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
};

// POST /articles — o dono vem do token, nunca do corpo: ninguém consegue
// salvar um artigo em nome de outra pessoa.
module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.status(STATUS.CREATED).send(withoutOwner(article)))
    .catch(next);
};

// DELETE /articles/:articleId — três saídas: não existe (404), é de outra
// pessoa (403) ou é de quem pediu (apaga e devolve o artigo apagado).
module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .select('+owner') // o dono não vem por padrão (select: false)
    .orFail(() => new NotFoundError(MESSAGES.ARTICLE_NOT_FOUND))
    .then((article) => {
      // owner é um ObjectId e req.user._id é uma string: comparar com ===
      // daria sempre false. equals() compara os dois pelo valor.
      if (!article.owner.equals(req.user._id)) {
        throw new ForbiddenError(MESSAGES.FORBIDDEN_ARTICLE);
      }
      // return: o próximo then só roda depois que a exclusão terminar.
      return article.deleteOne().then(() => res.send(withoutOwner(article)));
    })
    .catch(next);
};
