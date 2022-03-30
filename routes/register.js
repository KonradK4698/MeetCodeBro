
    const express = require('express');
    const router = express.Router();
    const session = require('../db')

    //add new user to neo4j database
    const addUser = (userName, userSurname) => {
        
        session
        .run(`CREATE (u:User {name:"${userName}", surname:"${userSurname}"})`)
        .catch(error => {
            console.log(error)
        })
        .then(() => session.close())
    }
    
    //add new user to db -  route
    router.post('/', (req,res)=>{
        const userName = req.body.name;
        const userSurname = req.body.surname;
        addUser(userName, userSurname)
        res.end();
    });


module.exports = router;

