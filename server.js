require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/dbconfig');
const session = require('express-session');
const {isAuthUser} = require('./middlewares/auth.js');
const fs = require('fs');

const store = new session.MemoryStore();

const PORT = process.env.PORT || 3500;
const connection = connectDB();

app.set('view engine','ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.DATABASE_SECRET,
    name:process.env.DATABASE_NAME,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*15
    },
    store
}));


app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/',require('./routes/root'));
app.use('/login',require('./routes/login'));
app.use('/register',require('./routes/register'));
app.use('/user',require('./routes/user'));

const conn = mongoose.connection;

conn.once('open',()=>{
    console.log('connected to mongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// find color pallete: https://coolors.co/e1ce7a-fbffb9-fdd692-ec7357-754f44 
