const express = require('express');
const router = express.Router();


router.get('/', (req,res)=>{
    res.send('welcome in home page');
});

module.exports = router