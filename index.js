const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();
const Person = require('./src/models/person');
require('dotenv').config();

app.use(cors());
app.use(express.json());
// eslint-disable-next-line no-undef
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

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send({ error: 'id Not Found' });
      }
    })
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.post('/api/persons', (req, res, next) => {
  const personName = req.body.name;
  const personNumber = req.body.number;

  const newPerson = new Person({
    id: Math.floor(Math.random() * 1000),
    name: personName,
    number: personNumber
  });

  newPerson
    .save()
    .then((savedPerson) => {
      res.status(201).send(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.put('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const personNumber = req.body.number;

  Person.findByIdAndUpdate(id, { number: personNumber }).then((person) => {
    res.status(200).json(person);
  });
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

app.get('/api/info', (req, res) => {
  const date = new Date();

  Person.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
    );
  });
});

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
