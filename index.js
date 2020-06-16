// Kovakoodatut puhelinnumerot
let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

const express = require('express')
const app = express()
app.use(express.json())

// Kaikki puhelinnumerot
app.get('/api/persons', (request, response) => {
  console.log('Requested all persons.')
  response.json(persons)
})

// Yksittäinen puhelinnumero
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(`Request on person with id: ${id}`)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {  // Mikäli henkilöä ei löytynyt
    console.log(`Requested person not found.`)
    response.status(404).end()
  }
})

// Yksittäinen poisto
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(`Request on delete person with id: ${id}`)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

// Sovelluksen yleistiedot
app.get('/info', (request, response) => {
  console.log('Requested info.')
  const personCount = persons.length
  const time = new Date()
  response.send(`Phonebook has info of ${personCount} people.<br/><br/>${time}`)
})

const PORT = 3001 // Käytettävä portti
// Sovellus tarkkailee valitun portin liikennettä.
app.listen(PORT, () => {
  console.log(`Server running, port: ${PORT}`)
})
