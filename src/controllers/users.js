const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
const validator = require('validator');
const User = require('../models/userSchema');
const { VALUE_ERROR, AUTH_ERROR, ERROR_NOT_FOUND, DEFAULT_ERROR } = require('../utils/errorConstants');

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      if (validator.isEmail(email)) {
        return User.create({
          name, about, avatar, email, password: hash,
        });
      }
      throw new Error('Что-то не так с адресом электронной почты');
      // return res.status(VALUE_ERROR).send({ message: 'Что-то не так с адресом электронной почты' });
    })
    .then((newUser) => res.send({ data: newUser }))
    .catch((err) => {
      // next(err);
      if (err.name === 'ValidationError') {
        next(new Error('Переданы некорректные данные при создании пользователя.'));
        // return res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        next(err);
        // return res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

// Получение списка пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ usersList: users }))
    .catch((err) => next(err));
};

// Получение пользователя по id
module.exports.getUser = (req, res, next) => {
  if (req.params.id !== 'me') {
    User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          next(new Error('Пользователь по указанному id не найден.'));
          // return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден.' });
        } else {
          res.send({ user });
        }
      })
      .catch((err) => {
        next(err);
        // if (err.name === 'CastError') {
        //   return res.status(VALUE_ERROR).send({ message: 'Неправильный id пользователя.' });
        // } else {
        //   return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию.' });
        // }
      });
  } else {
    User.findById(req.user._id)
      .then((user) => {
        if (!user) {

        }
        res.send({ user });
      })
      .catch((err) => next(err));
  }
};

// Обновление профиля
module.exports.updateProfile = (req, res, next) => {
  const {
    name = req.params.name,
    about = req.params.about,
    email = req.params.email,
    password = req.params.password,
  } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name, about, email, password,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({
        name: user.name, about: user.about, email: user.email, password: user.password,
      });
    })
    .catch((err) => {
      next(err);
      // if (err.name === 'ValidationError') {
      //   return res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      // } else if (err.name === 'NotFoundError') {
      //   return res.status(ERROR_NOT_FOUND).send({ message: ' Пользователь с указанным _id не найден.' });
      // } else {
      //   return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      // }
    });
};

// Обновление аватара
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user.avatar) {
        return res.send({ avatar: user.avatar });
      }
      return res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } if (err.name === 'NotFoundError') {
        return res.status(ERROR_NOT_FOUND).send({ message: ' Пользователь с указанным _id не найден.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
    });
};



module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }
      );
      res
        .cookie(
          'jwt',
          token,
          {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
            secure: true
          },
        )
      // .end();
      res.send({ 'token': token });
    })
    .catch((err) => {
      res.status(AUTH_ERROR).send({ message: err.message });
    });
};
