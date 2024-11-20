const express = require('express')
const router = require('./routes')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

const port = 5000
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());

app.use('/', router);

app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`)
})
;

