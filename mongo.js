const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://hffriman:${password}@hffriman-cluster-0.7nfekzi.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3 && process.argv.length < 6 && password) {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length >= 6) {
  console.log('Too many parameters. Make sure you follow this structure:')
  console.log('node mongo.js [your_password] [person_name] [person_phone_number]')
  mongoose.connection.close()
}

if (process.argv.length <= 3 && password) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}