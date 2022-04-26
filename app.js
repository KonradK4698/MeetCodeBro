const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const passport = require('passport');

const main = require('./routes/main');
const register = require('./routes/register');
const login = require('./routes/login');
const user = require('./routes/user');
const technologies = require('./routes/technologies');
const friends = require('./routes/friends');
const catalog = require('./routes/catalog');


//initialize dotenv
require('dotenv').config();

//passport configuration
require('./config/passport')(passport);

//initialize the passport object on every request
app.use(passport.initialize());

//main page router
app.use('/', main);

app.use(express.json())

//register user - api
app.use('/api/register', register);

//login user - api
app.use('/api/login', login);

//user profile - api
app.use('/api/user', passport.authenticate('jwt', { session: false }), user)

//technologies - api
app.use('/api/technologies', passport.authenticate('jwt', { session: false }), technologies)

//create friends - api
app.use('/api/friends',  passport.authenticate('jwt', { session: false }), friends)

//create users catalog - api
app.use('/api/catalog', passport.authenticate('jwt', { session: false }), catalog)


app.listen(port, () => {
    console.log("Aplikacja uruchomiona");
});

