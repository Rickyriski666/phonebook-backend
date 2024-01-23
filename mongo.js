const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if (!password) {
  console.log('give password as argument');
  process.exit(1);
}

const url = `mongodb+srv://rickyriski:${password}@database.5ivmwjy.mongodb.net/phoneBooks?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: name,
  number: number
});

if (!name || !number) {
  Person.find({}).then((result) => {
    console.log(`PhoneBook:`);
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  person.save().then((result) => {
    console.log('person saved!');
    mongoose.connection.close();
  });
}
