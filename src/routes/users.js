const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const { auth } = require('../middlewares/auth');

router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30)
  })
}), updateProfile);

router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(2).pattern(new RegExp('(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$#?'))
  })
}), updateAvatar);

router.get('/users/me', auth, getUser);

router.get('/users/:id', auth, celebrate({
  body: Joi.object().keys({
    id: Joi.string().length(24).hex().required()
  })
}), getUser);

router.get('/users', auth, getUsers);

module.exports = router;
