/* eslint-disable no-else-return */
const User = require('../models/userSchema');

const VALUE_ERROR = 400;
const ERROR_NOT_FOUND = 404;
const DEFAULT_ERROR = 500;

// Создание пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => res.send({ data: newUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

// Получение списка пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ usersList: users }))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Не пришел список пользователей из базы.' }));
};

// Получение пользователя по id
module.exports.getUser = (req, res) => {
  if (req.params.id !== 'me') {
    User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден.' });
        }
        return res.send({ user });
      })
      .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию.' }));
  }
};

// Обновление профиля
module.exports.updateProfile = (req, res) => {
  const { name = req.params.name, about = req.params.about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
    },
  )
    .then((user) => {
      res.send({ me: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'NotFoundError') {
        return res.status(ERROR_NOT_FOUND).send({ message: ' Пользователь с указанным _id не найден.' });
      } else {
        return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

// Обновление аватара
module.exports.updateAvatar = (req, res) => {
  const { avatar = req.params.avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send({ me: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err.name === 'NotFoundError') {
        return res.status(ERROR_NOT_FOUND).send({ message: ' Пользователь с указанным _id не найден.' });
      } else {
        return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};
