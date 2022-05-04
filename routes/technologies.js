const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const driver = require('../db');


router.get('/', (req,res)=>{

    const session = driver.session();
    let technologyArr = [];
    session.run(`MATCH (t:Technologies) RETURN t AS technologies`).subscribe({
        
        
        onNext:  (data) => {
            const technologyInfo = data.get('technologies');
            let newTechnology = {
                ID: technologyInfo.identity.low,
                Name: technologyInfo.properties.name
            }
            technologyArr.push(newTechnology);
        },
        onCompleted: () => {res.status(200); res.send(JSON.stringify(technologyArr)); },
        onError: (err) => {console.log(err)}

    })

})

router.get('/:userID', (req,res)=>{

    const session = driver.session(); 
    let userTechnology = []; 
    const userID = req.params.userID;
    session.run(`MATCH (u:User)-[k:Know]->(t:Technologies) WHERE ID(u) = ${userID} RETURN t AS tech ORDER BY t.name ASC`).subscribe({
        onNext: (data) => {
            const technology = data.get('tech');

            let getTechnology = {
                ID:  technology.identity.low, 
                Name: technology.properties.name
            }

            userTechnology.push(getTechnology);
        },
        onCompleted: () => {res.status(200).send(userTechnology); session.close()},
        onError: (err) => {console.log(err)}
    })
})


module.exports = router;