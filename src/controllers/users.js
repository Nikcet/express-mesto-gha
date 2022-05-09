const user = require("../schemas/userSchema");

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  user.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: "Не создался пользователь в базе." }));

};

// Получение списка пользователей
module.exports.getUsers = (req, res, next) => {
  user.find({})
    .then(users => res.send({ usersList: users }))
    .catch(err => res.status(500).send({ message: "Не пришел список пользователей из базы." }));

}

// Получение пользователя по id
module.exports.getUser = (req, res, next) => {
  if (req.params.id !== "me") {
    user.findById(req.params.id)
      .then(user => res.send({ user }))
      .catch(err => res.status(500).send({ message: "Не пришел пользователь из базы." }));
  }
}

// // Получение пользователя me
// module.exports.getMe = (req, res, next) => {
//   user.findById(req.user._id)
//     .then(user => res.send({ user }))
//     .catch(err => res.status(500).send({ message: "Не пришел пользователь me из базы." }));
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
      switch (err.status) {
        case 400:
          res.send({ message: "Переданы некорректные данные." });
          break;
        case 404:
          res.send({ message: "Пользователь не найден." });
          break;
        default:
          res.send({ status: err.status, name: err.name, message: "Данные не обновились." });
          break;
      }
    })
}

// Обновление аватара
module.exports.updateAvatar = (req, res) => {
  const { avatar=null } = req.body;
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
      switch (err.status) {
        case 400:
          res.send({ message: "Переданы некорректные данные." });
          break;
        case 404:
          res.send({ message: "Пользователь не найден." });
          break;
        default:
          res.send({ status: err.status, name: err.name, message: "Данные не обновились." });
          break;
      }
    })
}

// // Ставит лайк карточке
// module.exports.setLike = (req, res) => {

// }

// // Убирает лайк у карточки
// module.exports.removeLike = () => {

// }