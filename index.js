require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')
var morgan = require('morgan')

// Lisätään morganiin token, joka pitää sisällään pyynnön lähettämän datan.
morgan.token('data', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :data'))
app.use(express.static('build'))

// Kaikki puhelinnumerot
app.get('/api/persons', (request, response) => {
  // Haetaan kaikki puhelinnumerot tietokannasta.
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Yksittäinen puhelinnumero, EI KÄYTÖSSÄ FRONTENDIN TOIMESTA!
app.get('/api/persons/:id', (request, response) => {
  // Haetaan yksittäinen henkilö tietokannasta id:n avulla.
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

// Yksittäinen lisäys
app.post('/api/persons', (request, response) => {
  const reqBody = request.body

  if (!reqBody.name || !reqBody.number) {
    return response.status(400).json({
      error: "Bad request: content missing."
    })
  }

  const newPerson = new Person ({
    name: reqBody.name,
    number: reqBody.number
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// Yksittäinen poisto
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  //console.log(`Request on delete person with id: ${id}`)

  // Poistettavaa henkilöä ei löydy.
  if (!persons.some(p => p.id === id)) {
    response.status(404).end()
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

const PORT = process.env.PORT  // Käytettävä portti
// Sovellus tarkkailee valitun portin liikennettä.
app.listen(PORT, () => {
  console.log(`Server running - Port: ${PORT}`)
})
