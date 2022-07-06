const jwt = require('jsonwebtoken');
const { AUTH_ERROR } = require('../utils/errorConstants')

module.exports.auth = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(AUTH_ERROR)
      .send({ message: 'Необходима авторизация' });
  };

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
    );
  } catch (err) {
    return res
      .status(AUTH_ERROR)
      .send({ message: err.message });
  }

  req.user = payload;
  next();
}