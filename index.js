const express = require('express')
const app = express()
require('dotenv').config()
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
app.get('/api/persons/:id', (request, response, next) => {
  // Haetaan yksittäinen henkilö tietokannasta id:n avulla.
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Yksittäinen lisäys
app.post('/api/persons', (request, response, next) => {
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

  newPerson.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// Yksittäinen poisto
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      }
      else {  // Jos poistettavaa ei löydy, mutta id oikeaa muotoa.
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Yksittäisen tiedon muokkaus
app.put('/api/persons/:id', (request, response, next) => {
  const reqBody = request.body
  console.log(reqBody)

  const person = {
    name: reqBody.name,
    number: reqBody.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// Sovelluksen yleistiedot
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const personCount = persons.length
    const time = new Date()
    response.send(`Phonebook has info of ${personCount} people.<br/><br/>${time}`)
  })
})

// Olemattomine osoitteiden käsittely, esim. /api/xd...
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'Unknown endpoint.'
  })
}

app.use(unknownEndpoint)

// Virheidenkäsittelijä
const errorHandler = (error, request, response, next) => {
  console.error(`Error: ${error.message}`)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({
      error: 'Malformatted id.'
    })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT  // Käytettävä portti
// Sovellus tarkkailee valitun portin liikennettä.
app.listen(PORT, () => {
  console.log(`Server running - Port: ${PORT}`)
})
