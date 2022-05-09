const express = require('express');
const userRouter = require('./src/routes/users');
const cardRouter = require('./src/routes/cards');
const { HardcodeUser } = require('./src/utils/HardcodeUser');
const { cors } = require('./src/utils/cors');
const { default: mongoose } = require('mongoose');
const { PORT = 3000 } = process.env;

const app = express();

mongoInit().catch(err => console.log(err));

async function mongoInit() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors);
app.use(HardcodeUser);

app.use('/', userRouter);
app.use('/', cardRouter);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})