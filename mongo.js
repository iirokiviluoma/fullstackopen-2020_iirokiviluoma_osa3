const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as argument!')
  process.exit(1)
}

const password = process.argv[2]
const dbName = 'phonebook'

const mongoUrl = `mongodb+srv://fullstack:${password}@cluster-iiroki-3brfh.mongodb.net/${dbName}?retryWrites=true`

mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

// Jos ylimääräisiä argumentteja ei ole annettu.
if (!process.argv[3] && !process.argv[4]) {
  Person.find({}).then(result => {
    console.log('Current phonebook:')
    result.forEach(p => {
      console.log(`${p.name}: ${p.number}`)
    })
  })
  mongoose.connection.close()
}

else {
  const newName = process.argv[3]
  const newNumber = process.argv[4]

  const person = new Person({
    name: newName,
    number: newNumber
  })

  person.save().then(result => {
    console.log(`${person.name} saved.`)
    mongoose.connection.close()
})
}