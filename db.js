require('dotenv').config()

const neo4j = require('neo4j-driver')
const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic(process.env.DB_LOGIN, process.env.DB_PASSWORD));



console.log("Baza danych działa");

 module.exports = driver;
