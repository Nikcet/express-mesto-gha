const express = require('express');
const router = require("./src/routes/users");
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
  req.user = {
    _id: '6277b4bf607fa1b0429f0092'
  };

  next();
});

app.use('/', router);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})