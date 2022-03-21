
    const express = require('express');
    const router = express.Router();
    const neo4j = require('neo4j-driver')
const bodyParser = require('body-parser')

const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'Kwakus1998'))

const session = driver.session()
    
    const addUser = (userName, userSurname) => {
        session
        .run(`CREATE (p:Person {name:"${userName}", surname:"${userSurname}"})`)
        .catch(error => {
            console.log(error)
        })
        .then(() => session.close())
    }
    
    
    router.post('/', (req,res)=>{
        const userName = req.body.name;
        const userSurname = req.body.surname;
        addUser(userName, userSurname)
        res.end();
    });


module.exports = router;

