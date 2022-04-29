const express = require('express');
const router = express.Router();
const driver = require('../db');

const getNecessaryUserData = (usersData) => {
    const newUserData = {
        id: usersData.identity.low,
        label: usersData.labels,
        name: usersData.properties.name, 
        surname: usersData.properties.surname
    }
    return newUserData;
} 

let testData = {
    name: "Konrad",
    surname: "Kmak",
    technologies: ["JavaScript"],
    socialMedia: {
        linkedin: true,
        github: true
    }
}

const createQuery = (data) => {
    let startQuery = " MATCH (u:User), (t:Technologies)";
    let whereQuery = ''
    let withQuery = ' WITH count( DISTINCT u) AS userCount'
    let endQuery = " RETURN DISTINCT u AS users, userCount"
    if(data.name !== ''){
        whereQuery += ` u.name CONTAINS "${data.name}"`;
    }

    if(data.surname !== ''){
        if(whereQuery !== ''){
            whereQuery += ` AND u.surname CONTAINS "${data.surname}"`;
        }else{
            whereQuery += ` u.surname CONTAINS "${data.surname}"`;
        }
    }

    if(data.technologies.length !== 0){
        if(whereQuery !== ''){
            whereQuery += ` AND t.name IN ${JSON.stringify(data.technologies)} AND (u)-[:Know]->(t)`;
        }else{
            whereQuery += ` t.name IN ${JSON.stringify(data.technologies)} AND (u)-[:Know]->(t)`;
        }
    }

    if(Object.keys(data.socialMedia).length !== 0){
        for(const social in data.socialMedia){
            if(whereQuery !== ''){
                whereQuery += `${data.socialMedia[social] ? ` AND u.${social} IS NOT NULL` : ""}`;
            }else{
                whereQuery += `${data.socialMedia[social] ? ` u.${social} IS NOT NULL` : ""}`;
            }
        }
        
    }

    const query = `${startQuery}${whereQuery != '' ? ` WHERE ${whereQuery}` : ""}${withQuery}${startQuery}${whereQuery != '' ? `WHERE ${whereQuery}` : ""}${endQuery}`;

    console.log(query.trim());
    return query.trim()
}



// //pobierz liczbę użytkowników dostępnych w bazie danych
// router.get('/userCount', (req,res)=>{
//     const session = driver.session();
//     let userCount = 0
//     session.run('MATCH (u:User) RETURN count(u) AS usersCount').subscribe({
//         onNext: (data) => {
//             userCount = data.get('usersCount').low;
//         },
//         onCompleted: () => {
//             res.status(200).send(JSON.stringify(userCount));
//             session.close()},
//         onError: (err) => {console.log(err)}
//     })
// })

//pobierz dane o użytkownikach niezbędne do wyświetlenia w katalogu
router.post('/getUsers/:page/:limit', (req,res)=>{
    const session = driver.session();
    const skip = req.params.page;
    const limit = req.params.limit;
    const usersArray = [];
    const dataToSend = {
        userCount: 0, 
        users: usersArray
    }
    const searchData = {
        name: req.body.name,
        surname: req.body.surname,
        technologies: req.body.technologies,
        socialMedia: req.body.socialMedia
    }
    const query = createQuery(searchData);
    console.log(`${query} ORDER BY ID(users) SKIP ${skip} LIMIT ${limit}`);
    session.run(`${query} ORDER BY ID(users) SKIP ${skip} LIMIT ${limit}`).subscribe({
        onNext: (data) => {
            const usersData = data.get('users');
            const userCount = data.get('userCount');
            dataToSend.userCount = userCount.low;
            const newUser = getNecessaryUserData(usersData);
            usersArray.push(newUser);
        },
        onCompleted: ()=>{
            res.status(200).send(dataToSend); 
            session.close()},
        onError: (err)=>{console.log(err)}
    })
})


module.exports = router;
