/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const userRouter = require('./src/routes/users');
const cardRouter = require('./src/routes/cards');
const loginRouter = require('./src/routes/login');
const { cors } = require('./src/utils/cors');
const NotFoundError = require('./src/errors/not-found-error');
const { auth } = require('./src/middlewares/auth');
const { PORT = 3000 } = process.env;

const app = express();

async function mongoInit() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
}

mongoInit().catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors);
app.use(helmet());

app.use('/', loginRouter);
app.use('/', userRouter);
app.use('/', cardRouter);

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Путь не найден'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
