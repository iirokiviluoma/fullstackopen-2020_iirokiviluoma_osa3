const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URL

console.log(`Connecting to MongoDB: ${url}`)
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => {
    console.log(`Connected to MongoDB.`)
  })
  .catch((error) => {
    console.log(`Connection error: ${error.message}`)
  })

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  // Muutetaan Mongoose-oliot haluttuun muotoon.
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personSchema)
