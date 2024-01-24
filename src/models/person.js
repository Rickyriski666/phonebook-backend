const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const url = process.env.MONGO_DB_URL;

console.log('connecting to DB...');
mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to DB');
  })
  .catch((err) => {
    console.log('failed connect to DB', err.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

personSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);
