/* eslint-disable max-len */
const Card = require('../models/cardSchema');

const { ValueError } = require('../errors/value-error');
const { NotFoundError } = require('../errors/not-found-error');

// Создает карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => {
      if (!newCard) {
        throw new ValueError('Переданы некорректные данные при создании карточки');
      }

      res.send({ data: newCard })
    })
    .catch(next);
};

// Получает список карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      if (!cards) {
        throw new ValueError('Переданы некорректные данные');
      }
      res.send({ cardList: cards })
    })
    .catch(next);
};

// Удаляет карточку
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }

      return res.send({ deletedCard, message: 'Карточка успешно удалилась.' });
    })
    .catch(next);
};

// Ставит лайк карточке
module.exports.setLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: {
        likes: req.user._id,
      },
    },
    { new: true },
  )
    .then((newCard) => {
      if (!newCard) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }

      return res.send({ message: 'ОК' });
    })
    .catch(next);
};

// Убирает лайк у карточки
module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: {
        likes: req.user._id,
      },
    },
    { new: true },
  )
    .then((newCard) => {
      if (!newCard) {
        throw new NotFoundError('Передан несуществующий id карточки');
      }

      return res.send({ message: 'ОК' });
    })
    .catch(next);
};
