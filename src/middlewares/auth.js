const jwt = require('jsonwebtoken');
const { AUTH_ERROR } = require('../utils/errorConstants')

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(AUTH_ERROR)
      .send({ message: 'Необходима авторизация' });
  };
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(AUTH_ERROR)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
}