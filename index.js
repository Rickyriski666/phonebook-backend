const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();
const Person = require('./models/person');
require('dotenv').config();

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
];

app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'dist')));

morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] :response-time ms :body')
);

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  Person.findById(id).then((person) => {
    res.json(person);
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const personName = req.body.name;
  const personNumber = req.body.number;

  // const checkPerson = Person.find({ name: personName }).then((person) => {
  //   return person[0].name;
  // });

  // console.log(checkPerson);
  // if (checkPerson) {
  //   return res.status(400).json({
  //     error: 'name must be unique'
  //   });
  // }

  // if (!personName) {
  //   return res.status(400).json({
  //     error: 'name is missing'
  //   });
  // }

  // if (!personNumber) {
  //   return res.status(400).json({
  //     error: 'number is missing'
  //   });
  // }

  const newPerson = new Person({
    id: Math.floor(Math.random() * 1000),
    name: personName,
    number: personNumber
  });

  newPerson.save().then((savedPerson) => {
    res.status(201).send(savedPerson);
  });
});

app.put('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const personInfo = persons.find((person) => person.id === id);

  if (!personInfo) {
    return res.status(400).json({
      error: 'person not found'
    });
  }

  const newPerson = {
    ...personInfo,
    name: req.body.name,
    number: req.body.number
  };

  persons = persons.map((person) => (person.id !== id ? person : newPerson));
  res.json(persons);
});

app.get('/api/info', (req, res) => {
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
  );
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
