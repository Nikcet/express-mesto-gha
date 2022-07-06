const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/userSchema');
const { AuthError } = require('../errors/authorization-error');
const { ValueError } = require('../errors/value-error');
const { NotFoundError } = require('../errors/not-found-error');
const { DefaultError } = require('../errors/default-error');

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
      throw new ValueError('Переданы некорректные данные при создании пользователя');
      // return res.status(VALUE_ERROR).send({ message: 'Что-то не так с адресом электронной почты' });
    })
    .then((newUser) => res.send({ data: newUser }))
    .catch(next);
};

// Получение списка пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new DefaultError('Что-то пошло не так');
      }

      res.send({ usersList: users });
    })
    .catch(next);
};

// Получение пользователя по id
module.exports.getUser = (req, res, next) => {
  const findUser = (id) => {
    User.findById(id)
      .then((user) => {
        if (!user) {
          throw new NotFoundError('Пользователь по указанному id не найден');
        }

        res.send({ user });
      })
      .catch(next);
  }

  if (req.params.id !== 'me') {
    findUser(req.params.id);
  } else {
    findUser(req.user._id);
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
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      res.send({
        name: user.name, about: user.about, email: user.email, password: user.password,
      });
    })
    .catch(next);
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
      if (!user.avatar) {
        throw new ValueError('Переданы некорректные данные при обновлении аватара');
      }
      return res.send({ avatar: user.avatar });
    })
    .catch(next);
};



module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password, next)
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
          }
        )
        .end();
        throw new AuthError('Не удалось авторизоваться');
    })
    .catch(next);
};
