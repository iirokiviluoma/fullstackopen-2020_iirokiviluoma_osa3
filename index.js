// Käytettävä portti
const PORT = 3001

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

// Palautetaan kaikki puhelinnumerot
app.get('/api/persons', (request, response) => {
  console.log('Requested all persons.')
  response.json(persons)
})

// Sovellus tarkkailee portin 3001 liikennettä.
app.listen(PORT, () => {
  console.log(`Server running, port: ${PORT}`)
})
