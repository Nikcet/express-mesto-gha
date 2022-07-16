const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard,
  getCards,
  deleteCard,
  setLike,
  removeLike,
} = require('../controllers/cards');
const linkRegExp = require('../utils/regexp');

const { auth } = require('../middlewares/auth');

router.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2),
    link: Joi.string().min(2).pattern(linkRegExp),
  }),
}), createCard);

router.get('/cards', auth, getCards);

router.delete('/cards/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), setLike);

router.delete('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), removeLike);

module.exports = router;
