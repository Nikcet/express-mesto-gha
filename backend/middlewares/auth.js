const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authorization-error');

module.exports.auth = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  console.log(req.cookies.jwt);
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};