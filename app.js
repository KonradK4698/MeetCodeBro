const express = require('express');
const app = express();
const port = 3000; 

app.get('/', (req, res) => {
    res.send('Test aplikacji');
});

app.listen(port, () => {
    console.log("Aplikacja uruchomiona");
});