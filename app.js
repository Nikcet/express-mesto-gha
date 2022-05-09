const express = require('express');
// const cors = require("cors");
const userRouter = require("./src/routes/users");
const cardRouter = require("./src/routes/cards");
const meRouter = require("./src/routes/me");
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;

const app = express();

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(cors());

app.use((req, res, next) => {
  req.user = {
    _id: '6277b4bf607fa1b0429f0092'
  };

  next();
});

app.use('/', userRouter);
app.use('/', cardRouter);
// app.use('/users', meRouter);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})