const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const AuthError = require('../errors/authorization-error');
const ValueError = require('../errors/value-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    minlength: 2,
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator: function (value) {
        return /(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$#?/.test(value)
      },
      message: 'Не валидная ссылка на изображение'
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        if (!validator.isEmail(value)) {
          throw new ValueError('Не правильный Email');
        } else {
          return value;
        }
      }
    }
  },
  password: {
    type: String,
    required: true,
    select: false,
  }
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          return user;
        })
    })
}

userSchema.statics.findUserByEmail = function (email) {
  return this.findOne({ email })
  .then((user) => {
    return user;
  });
}

module.exports = mongoose.model('user', userSchema);
