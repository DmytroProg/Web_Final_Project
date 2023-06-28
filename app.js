const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cloudinary = require("cloudinary").v2;
require('dotenv').config()

const dbUrl = process.env.DB_URL

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

const app = express()
//const jsonParser = express.json();

const collerController = require('./coller_back')
const userController = require('./users_back')

app.use('/coller', collerController)
app.use('/user', userController)
app.use(express.static(path.join(__dirname, '/public')));

const PORT = 3000; //process.env.PORT || 3000

mongoose.connect(dbUrl)
.then((res) => { 
    console.log('connected to db') 
    app.listen(PORT, () => {
        console.log('server is running')
    })
})
.catch((err) => { console.err("DB connection error", err) })