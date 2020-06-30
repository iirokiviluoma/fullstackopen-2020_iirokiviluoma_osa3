const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URL

console.log(`Connecting to MongoDB: ${url}`)
mongoose.connect(url,
  {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(result => {
    console.log(`Connected to MongoDB.`)
  })
  .catch((error) => {
    console.log(`Connection error: ${error.message}`)
  })

  const personSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    number: {type: String, required: true}
  })

  personSchema.plugin(uniqueValidator)

  // Muutetaan Mongoose-oliot haluttuun muotoon.
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personSchema)
