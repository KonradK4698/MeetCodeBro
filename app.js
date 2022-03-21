const express = require('express');
const app = express();
const port = 3000;
const main = require('./routes/main');
const register = require('./routes/register')
const neo4j = require('neo4j-driver')

const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'Kwakus1998'))

const session = driver.session()

session
  .run('MATCH (konrad {name:"Konrad"}) RETURN konrad')
  .then(result => {
    result.records.forEach(record => {
      console.log(record.get('konrad'))
    })
  })
  .catch(error => {
    console.log(error)
  })
  .then(() => session.close())

//main page router
app.use('/', main);

//register page router
app.use('/', register);


app.listen(port, () => {
    console.log("Aplikacja uruchomiona");
});