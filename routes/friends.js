const express = require('express');
const router = express.Router();
const driver = require('../db');

//wyświetl wszystkie zaproszenia
router.get('/getInvitation', (req,res)=>{
    const session = driver.session();
    const userID = req.body.ID; 
    session.run(`MATCH (u:User) WHERE ID(u) = ${userID} MATCH (u)-[i:InviteToFriends]-() RETURN i AS invitations`).subscribe({
        onNext: (data) => {console.log(data.get('invitations')) },
        onCompleted: ()=>{console.log("Pobrano relacje"); res.end()},
        onError: (err)=>{console.log(err)}
    })
})

//wyślij użytkownikowi prośbę o dodanie do znajomych
router.post('/sendInvitation/:ID', (req,res)=>{
    const session = driver.session();
    const senderID = req.params.ID;
    const recipentID = req.body.ID;
    session.run(`MATCH (sender:User), (recipent:User) WHERE ID(sender) = ${senderID} AND ID(recipent) = ${recipentID} CREATE (sender)-[i:InviteToFriends]->(recipent) RETURN type(i) AS type`).subscribe({
        onNext: (data) => {console.log(data.get('type'))},
        onCompleted: ()=>{console.log("Utworzono relację"); res.end()},
        onError: (err)=>{console.log(err)}
    })
})

//odrzuć (usuń) prośbę o dodanie do znajomych
router.delete('/deleteInvitation/:ID', (req,res)=>{
    const session = driver.session();
    const userID = req.params.ID;
    const invitationID = req.body.ID;
    session.run(`MATCH (u:User) WHERE ID(u) = ${userID} MATCH (u)-[i:InviteToFriends]-() WHERE (i IS NOT NULL = true AND ID(i) = ${invitationID}) DELETE i RETURN true AS confirmation`).subscribe({
        onNext: (data) => {console.log(data.get('confirmation'))},
        onCompleted: ()=>{console.log("Usunięto relację"); res.end()},
        onError: (err)=>{console.log(err)}
    })
})

//wyświetl wszystkich przyjaciół
router.get('/', (req,res)=>{
    const session = driver.session();
    const userID = req.body.ID; 
    session.run(`MATCH (u:User) WHERE ID(u) = ${userID} MATCH (u)-[f:IsFriend]->() RETURN f AS friends`).subscribe({
        onNext: (data) => {console.log(data.get('friends')) },
        onCompleted: ()=>{console.log("Pobrano relacje"); res.end()},
        onError: (err)=>{console.log(err)}
    })
})

//dodaj do listy przyjaciół 
router.post('/:ID', (req,res)=>{
    const session = driver.session(); 
    const recipentID = req.body.ID;
    const senderID = req.params.ID; 
    session.run(`MATCH (sender: User), (recipent: User) WHERE ID(sender) = ${senderID} AND ID(recipent) = ${recipentID} CREATE (sender)-[f1:IsFriend]->(recipent), (recipent)-[f2:IsFriend]->(sender) RETURN true AS confirmation`).subscribe({
        onNext: (data) => {console.log(data.get('confirmation'))},
        onCompleted: ()=>{console.log("Dodano użytkownika do przyjaciół"); res.end()},
        onError: (err)=>{console.log(err)}
    })
})

//usuń użytkownika ze znajomych
router.delete('/:ID', (req,res)=>{
    const session = driver.session(); 
    const userID = req.body.ID; 
    const friendID = req.params.ID; 
    session.run(`MATCH (user: User), (friend: User) WHERE ID(user) = ${userID} AND ID(friend) = ${friendID} MATCH (user)-[f:IsFriend]-(friend) DELETE f RETURN COUNT(f) AS deletedRelationCount`).subscribe({
        onNext: (data) => {console.log(data.get('deletedRelationCount'))},
        onCompleted: ()=>{console.log("Usunięto przyjaciela"); res.end()},
        onError: (err)=>{console.log(err)}
    })
})

module.exports = router;