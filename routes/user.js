const express = require('express');
const router = express.Router();
const driver = require('../db');
const session = driver.session();

const getDataWithoutSaltHash = (userDataInfo) => {
    const userDataProperties = userDataInfo.properties;
            let propertiesWithoutSaltHash = {};
            for(const key in userDataProperties){
                if(userDataProperties.hasOwnProperty(key) && key !== "hash" && key !== "salt"){
                    propertiesWithoutSaltHash[key] =  userDataProperties[key];
                }
            }
            const userDataInfoJSON = propertiesWithoutSaltHash;

            return userDataInfoJSON
}

router.get('/:id', (req,res)=>{

    const session = driver.session();

    session.run(`MATCH (u:User) WHERE ID(u) = ${req.params.id} RETURN u as USER`).subscribe({

        onNext: userData => {
            const userDataInfo = userData.get('USER');
            
            let userDataInfoJSON = getDataWithoutSaltHash(userDataInfo)

            res.status(200).send(userDataInfoJSON);
        },
        onCompleted: () => {session.close(); res.end()},
        onError: (err) => {console.log(err)}

    })

})

router.get('/moreThenOne/id/:param', (req,res)=>{
    const session = driver.session();
    const userIdArr = req.params.param;
    let userDataInfoJsonArr = [];
    session.run(`MATCH (u:User) WHERE id(u) IN ${userIdArr} RETURN u as USER`).subscribe({
        onNext: userData => {
            const userDataInfo = userData.get('USER');
            const newUserData = getDataWithoutSaltHash(userDataInfo)
            userDataInfoJsonArr.push(newUserData);
        },
        onCompleted: () => {console.log(userDataInfoJsonArr);res.status(200).send(userDataInfoJsonArr); session.close();},
        onError: (err) => {console.log(err)}
    })
})

router.post('/:id', (req,res)=>{
    const session = driver.session();

    session.run(`MATCH (u:User) WHERE ID(u) = ${req.params.id} SET 
                u.name = "${req.body.name}" ,
                u.surname = "${req.body.surname}" ,
                u.description = "${req.body.description}" ,
                u.github = "${req.body.github}" ,
                u.linkedin = "${req.body.linkedin}" `).subscribe({
                    onNext: data => console.log(data),
                    onCompleted: () => {session.close(); res.status(201).end()},
                    onError: (err) => {console.log(err)}
                })
})

router.post('/technologies/:id', (req,res)=>{
    const session = driver.session();
    const userID = req.params.id;
    const choosenTechnologyIDArr = req.body;
    session.run(`MATCH (t:Technologies), (u:User) WHERE ID(u) = ${userID} AND [techName IN [${choosenTechnologyIDArr}] WHERE ID(t) = techName] CREATE (u)-[k:Know]->(t) RETURN k`).subscribe({
        onNext: data => console.log(data.get('k')),
        onCompleted: () => {session.close(); res.status(201).end()},
        onError: (err) => {console.log(err)}
    })
})

router.delete('/technologies/:id/:techID', (req,res) => {
    const session = driver.session(); 
    const userID = req.params.id; 
    const techIdToDelete = req.params.techID; 
    session.run(`MATCH (u:User)-[k:Know]->(t:Technologies) WHERE ID(u) = ${userID} AND [techID IN ${techIdToDelete} WHERE ID(t) = techID] DELETE k`).subscribe({
        onNext: (data) => {console.log(data.get('k'))},
        onCompleted: () => {session.close(); res.status(200).end()},
        onError: (err) => {console.log(err)}
    })
})



module.exports = router;