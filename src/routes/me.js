const router = require('express').Router();
const { updateProfile, getUser } = require('../controllers/users');

router.patch('/users/me', updateProfile);

// router.get('/users/me', getUser);

module.exports = router;