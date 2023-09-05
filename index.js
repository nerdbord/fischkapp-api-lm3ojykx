require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URL)
const db = mongoose.connection;
db.on('error',(error) => console.log(error));
db.once('open', () => console.log('Connected to database'))


app.listen(PORT, () => {
  console.log(`Your app listening on port ${PORT}`);
});