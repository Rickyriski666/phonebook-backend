const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

// eslint-disable-next-line no-undef
const url = process.env.MONGO_DB_URL;

console.log('connecting to DB...');
mongoose
  .connect(url)
  .then(() => {
    console.log('connected to DB');
  })
  .catch((err) => {
    console.log('failed connect to DB', err.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 8,

    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`
    }
  }
});

personSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);
