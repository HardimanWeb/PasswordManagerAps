const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const dataBase = require ('./model/connection')

app.use(bodyParser.json())

// routes/endpoint start
app.get('/', (req, res) => {
    res.send("Bonjour")
})
app.get('/mahasiswa/:name', (req, res) => {
    const nama = req.params.name
    res.send(`spesifik mahasiswa by ${nama}`)
})
app.post('/', (req, res) => {})
app.put('/', (req, res) => {})
app.delete('/', (req, res) => {})

app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`)
})
