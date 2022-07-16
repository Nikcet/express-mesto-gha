const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard,
  getCards,
  deleteCard,
  setLike,
  removeLike,
} = require('../controllers/cards');

const { auth } = require('../middlewares/auth');

router.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2),
    link: Joi.string().min(2).pattern(/(https?:\/\/)([da-z.-]+).([a-z.]{2,6})([\\/w.-]*)*\/?$#?/),
  }),
}), createCard);

router.get('/cards', auth, getCards);

router.delete('/cards/:id', auth, celebrate({
  body: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', auth, setLike);

router.delete('/cards/:cardId/likes', auth, removeLike);

module.exports = router;
