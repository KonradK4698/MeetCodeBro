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

//pobierz liczbę użytkowników dostępnych w bazie danych
router.get('/userCount', (req,res)=>{
    const session = driver.session();
    let userCount = 0
    session.run('MATCH (u:User) RETURN count(u) AS usersCount').subscribe({
        onNext: (data) => {
            userCount = data.get('usersCount').low;
        },
        onCompleted: () => {
            res.status(200).send(JSON.stringify(userCount));
            session.close()},
        onError: (err) => {console.log(err)}
    })
})

//pobierz dane o użytkownikach niezbędne do wyświetlenia w katalogu
router.post('/getUsers', (req,res)=>{
    const session = driver.session();
    const skip = req.body.skip;
    const limit = req.body.limit;
    const usersArray = [];
    session.run(`MATCH (u:User) RETURN u AS users ORDER BY ID(users) SKIP ${skip} LIMIT ${limit}`).subscribe({
        onNext: (data) => {
            const usersData = data.get('users')
            const newUser = getNecessaryUserData(usersData);
            usersArray.push(newUser);
        },
        onCompleted: ()=>{res.status(200).send(usersArray); session.close()},
        onError: (err)=>{console.log(err)}
    })
})


module.exports = router;
