const express = require('express');
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


module.exports = router;