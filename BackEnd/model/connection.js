const mysql = require('mysql')

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "password_manager"
})

module.exports = db