const router = require('express').Router();
const {
  createUser,
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
  login,
} = require('../controllers/users');

const { auth } = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);
router.patch('/users/me', auth, updateProfile);
router.patch('/users/me/avatar', auth, updateAvatar);
router.get('/users/:id', auth, getUser);
router.get('/users', auth, getUsers);
router.get('/users/me', auth, getUser);

module.exports = router;
