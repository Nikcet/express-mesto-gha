/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const userRouter = require('./src/routes/users');
const cardRouter = require('./src/routes/cards');
const { HardcodeUser } = require('./src/utils/HardcodeUser');
// const errorsProc = require('./src/utils/errorsProc');
const { cors } = require('./src/utils/cors');
const { VALUE_ERROR, ERROR_NOT_FOUND, DEFAULT_ERROR } = require('./src/utils/errorConstants');

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

app.use('/', userRouter);
app.use('/', cardRouter);

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Путь не найден.' });
});

app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === 'CastError' || err.name === 'ValidationError' || err.name === 'Error'){
    res.status(VALUE_ERROR).send({ message: err.message });
  } else if (err.name === 'ErrorDocument') {
    res.status(ERROR_NOT_FOUND).send({ message: err.message });
  }
  else {
    res.status(DEFAULT_ERROR).send({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
