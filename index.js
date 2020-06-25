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
const cors = require('cors')
var morgan = require('morgan')

app.use(cors())
app.use(express.json())
// Lisätään token, joka pitää sisällään pyynnön lähettämän datan.
morgan.token('data', function (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :data'))
app.use(express.static('build'))

// Kaikki puhelinnumerot
app.get('/api/persons', (request, response) => {
  //console.log('Requested all persons.')
  response.json(persons)
})

// Yksittäinen puhelinnumero
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  //console.log(`Request on person with id: ${id}`)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {  // Mikäli henkilöä ei löytynyt
    //console.log(`Requested person not found.`)
    response.status(404).end()
  }
})

// Generoi numerolle uuden id:n käyttäen Math.random-funktiota.
const generateId = () => {
  const max = 9999
  let newId = 1 + Math.floor(Math.random() * max)
  //console.log(`Generated new id: ${newId}`)

  // Generoidaan kunnes löytyy vapaa id.
  while (persons.find(p => p.id === newId)) {
    //console.log(`Id already present, generating new one...`)
    newId = Math.floor(Math.random() * max)
    //console.log(`Generated new id: ${newId}`)
  }

  return newId
}

// Yksittäinen lisäys
app.post('/api/persons', (request, response) => {
  //console.log(`Request on adding a new person.`)
  const reqBody = request.body

  if (!reqBody.name || !reqBody.number) {
    return response.status(400).json({
      error: "Bad request!"
    })
  }

  if (persons.find(p => p.name === reqBody.name)) {
    return response.status(400).json({
      error: "Name already in the server."
    })
  }

  const newPerson = {
    name: reqBody.name,
    number: reqBody.number,
    id: generateId()
  }

  //console.log(newPerson)
  persons = persons.concat(newPerson)
  response.json(newPerson)
})

// Yksittäinen poisto
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  //console.log(`Request on delete person with id: ${id}`)

  // Poistettavaa henkilöä ei löydy.
  if (!persons.some(p => p.id === id)) {
    response.status(400).json({
      error: "Person not found."
    })
  }

  // Onnistunut poisto.
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

// Sovelluksen yleistiedot
app.get('/info', (request, response) => {
  //console.log('Requested info.')
  const personCount = persons.length
  const time = new Date()
  response.send(`Phonebook has info of ${personCount} people.<br/><br/>${time}`)
})

const PORT = process.env.PORT || 3001 // Käytettävä portti
// Sovellus tarkkailee valitun portin liikennettä.
app.listen(PORT, () => {
  console.log(`Server running - Port: ${PORT}`)
})
