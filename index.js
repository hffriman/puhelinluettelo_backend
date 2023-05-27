const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('build'))

app.use(express.json())

morgan.token('requestbody', function(req, res) {
    const requestBody = JSON.stringify(req.body)
    if (requestBody !== '{}') {
        return requestBody
    } else {
        return ' '
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestbody'))

app.use(cors())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

const generateId = () => {
    let randomId

    do {
        randomId = Math.floor(Math.random() * 10000)
    } while(persons.find(person => person.id === randomId))

    return randomId
}


app.get('/info', (request, response) => {

    const date = new Date()
    response.send(
        `<div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${date}</p>
        </div>    
        `)
})

app.get('/api/persons', (request, response) => {

    response.json(persons)
})

app.post('/api/persons', (request, response) => {

    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'The name is missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'The number is missing'
        })
    } else if (persons.find(person => person.name.toUpperCase() === body.name.toUpperCase())) {
        return response.status(400).json({
            error: 'The name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
    response.json(person)

    morgan.token('body', (req, res) => {
        return JSON.stringify(req.body)
    })
})

app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})