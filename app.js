const express = require('express');
const app = express();
const port = 3000;
const main = require('./routes/main');
const register = require('./routes/register')
const neo4j = require('neo4j-driver')
const bodyParser = require('body-parser')

const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'Kwakus1998'))

const session = driver.session()


//main page router
app.use('/', main);

app.use(express.json())
//register page router
app.use('/register', register);


app.listen(port, () => {
    console.log("Aplikacja uruchomiona");
});

