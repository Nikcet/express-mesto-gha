const user = require('../models/userSchema');

VALUE_ERROR = 400;
ERROR_NOT_FOUND = 404;
DEFAULT_ERROR = 500;

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  user.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя.' })
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию.' })
      }
    });

};

// Получение списка пользователей
module.exports.getUsers = (req, res, next) => {
  user.find({})
    .then(users => res.send({ usersList: users }))
    .catch(err => res.status(DEFAULT_ERROR).send({ message: 'Не пришел список пользователей из базы.' }));

}

// Получение пользователя по id
module.exports.getUser = (req, res, next) => {
  if (req.params.id !== 'me') {

    user.findById(req.params.id)
      .then(user => {
        if (!user) {
          return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден.' });
        }
        return res.send({ user });
      })
      .catch(err => res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию.' }));
  }
}

// // Получение пользователя me
// module.exports.getMe = (req, res, next) => {
//   user.findById(req.user._id)
//     .then(user => res.send({ user }))
//     .catch(err => res.status(DEFAULT_ERROR).send({ message: 'Не пришел пользователь me из базы.' }));
// }

// Обновление профиля
module.exports.updateProfile = (req, res) => {
  const { name = null, about = null } = req.body;
  user.findByIdAndUpdate(req.user._id, { name, about },
    {
      new: true,
      runValidators: true
    })
    .then(user => {
      if (user) {
        res.send({ me: user });
      }
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'NotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: ' Пользователь с указанным _id не найден.' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    })
}

// Обновление аватара
module.exports.updateAvatar = (req, res) => {
  const { avatar = null } = req.body;
  user.findByIdAndUpdate(req.user._id, { avatar },
    {
      new: true,
      runValidators: true
    })
    .then(user => {
      if (user) {
        res.send({ me: user });
      }
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(VALUE_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err.name === 'NotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: ' Пользователь с указанным _id не найден.' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию.' });
      }
    })
}
