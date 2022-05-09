const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  setLike,
  removeLike
} = require('../controllers/cards');

router.post('/cards', createCard);
router.get('/cards', getCards);
router.delete('/cards/:id', deleteCard);
router.put('/cards/:cardId/likes', setLike);
router.delete('/cards/:cardId/likes', removeLike);

module.exports = router;