const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createUser,
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
  login,
} = require('../controllers/users');

const { auth } = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8)
  })
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2),
    email: Joi.string().required(),
    password: Joi.string().required().min(8)
  })
}) , createUser);

router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string(),
    password: Joi.string().min(8)
  })
}), updateProfile);

router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(2)
  })
}), updateAvatar);

router.get('/users/:id', auth, getUser);

router.get('/users/me', auth, getUser);

router.get('/users', auth, getUsers);

module.exports = router;
