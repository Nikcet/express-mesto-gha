/* eslint-disable max-len */
/* eslint-disable no-else-return */
const Card = require('../models/cardSchema');

const VALUE_ERROR = 400;
const ERROR_NOT_FOUND = 404;
const DEFAULT_ERROR = 500;

// Создает карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.send({ data: newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

// Получает список карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ cardList: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные.' });
      } else {
        return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

// Удаляет карточку
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((deletedCard) => {
      if (deletedCard) {
        return res.send({ deletedCard, message: 'Карточка успешно удалилась.' });
      } else {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      } else if (err.name === 'CastError') {
        return res.status(VALUE_ERROR).send({ message: 'Передан некорректный id.' });
      } else {
        return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

// Ставит лайк карточке
module.exports.setLike = (req, res) => {
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
      if (newCard) {
        return res.send({ message: 'ОК' });
      } else {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки. ' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else if (err.name === 'NotFoundError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки. ' });
      } else {
        return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

// Убирает лайк у карточки
module.exports.removeLike = (req, res) => {
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
      if (newCard) {
        return res.send({ message: 'ОК' });
      } else {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки. ' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные для постановки/снятия лайка.' });
      } else if (err.name === 'NotFoundError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки. ' });
      } else {
        return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};
