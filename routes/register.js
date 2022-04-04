
    const express = require('express');
    const router = express.Router();
    const session = require('../db')

    //add new user to neo4j database
    const addUser = (userEmail, userPassword) => {
        
        session
        .run(`CREATE (u:User {email:"${userEmail}", password:"${userPassword}"})`)
        .catch(error => {
            console.log(error)
        })
        .then(() => session.close())
    }
    
    //add new user to db -  route
    router.post('/', (req,res)=>{
        const userEmail = req.body.email;
        const userPassword = req.body.password;
        addUser(userEmail, userPassword)
        res.end();
    });

    


module.exports = router;

