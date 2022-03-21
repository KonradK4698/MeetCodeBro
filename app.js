const express = require('express');
const app = express();
const port = 3000;
const main = require('./routes/main');
const register = require('./routes/register')
const bodyParser = require('body-parser')



//main page router
app.use('/', main);

app.use(express.json())
//register page router
app.use('/register', register);


app.listen(port, () => {
    console.log("Aplikacja uruchomiona");
});

