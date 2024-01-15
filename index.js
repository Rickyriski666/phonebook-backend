const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();

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
  },
  {
    id: 5,
    name: 'awikwok',
    number: '34872392'
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
  console.log(persons);
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const personInfo = persons.find((person) => person.id === id);

  if (personInfo) {
    res.json(personInfo);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const personName = req.body.name;
  const personNumber = req.body.number;

  const checkPerson = persons.find((person) => person.name === personName);
  if (checkPerson) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }

  if (!personName) {
    return res.status(400).json({
      error: 'name is missing'
    });
  }

  if (!personNumber) {
    return res.status(400).json({
      error: 'number is missing'
    });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000),
    name: personName,
    number: personNumber
  };

  persons = [...persons, newPerson];
  res.send(persons);
});

app.get('/api/info', (req, res) => {
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
