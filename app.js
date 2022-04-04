const express = require('express');
const app = express();
const port = 3000;
const main = require('./routes/main');
const register = require('./routes/register');
// const login = require('./routes/login');
const bodyParser = require('body-parser')


//initialize dotenv
require('dotenv').config();

//main page router
app.use('/', main);

app.use(express.json())

//register user - api
app.use('/api/register', register);

// //login user - api
// app.use('/api/login', login);


app.listen(port, () => {
    console.log("Aplikacja uruchomiona");
});

