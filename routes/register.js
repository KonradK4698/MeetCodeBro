
    const express = require('express');
    const router = express.Router();
    const session = require('../db')


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

