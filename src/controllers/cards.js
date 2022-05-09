/* eslint-disable no-undef */
const card = require('../models/cardSchema');

VALUE_ERROR = 400;
ERROR_NOT_FOUND = 404;
DEFAULT_ERROR = 500;

// Создает карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.send({ data: newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

// Получает список карточек
module.exports.getCards = (req, res) => {
  card.find({})
    .populate('owner')
    .then((cards) => res.send({ cardList: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

// Удаляет карточку
module.exports.deleteCard = (req, res) => {
  card.findByIdAndRemove(req.params.id)
    .then((deletedCard) => res.send({ deletedCard, message: 'Карточка успешно удалилась.' }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

// Ставит лайк карточке
module.exports.setLike = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: {
        likes: req.user._id,
      },
    },
    { new: true },
  )
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else if (err.name === 'NotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки. ' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

// Убирает лайк у карточки
module.exports.removeLike = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: {
        likes: req.user._id,
      },
    },
    { new: true },
  )
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные для постановки/снятия лайка.' });
      } else if (err.name === 'NotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки. ' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};
