const express = require('express');
const app = express();
const port = 3000; 
const main = require('./routes/main');

//main page router
app.use('/', main);


app.listen(port, () => {
    console.log("Aplikacja uruchomiona");
});