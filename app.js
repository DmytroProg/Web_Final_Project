const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cloudinary = require("cloudinary").v2;

const dbUrl = 'mongodb+srv://admin:admin123@cluster0.yqrjwor.mongodb.net/Coller'

cloudinary.config({ 
    cloud_name: 'dtj8b4srd', 
    api_key: '545831795372558', 
    api_secret: 'Irr3v4LrZmuCuxy-i-FKRln9EIE' 
});

const app = express()
//const jsonParser = express.json();

app.use(express.static(path.join(__dirname, '/public')));

const PORT = process.env.PORT || 3000

mongoose.connect(dbUrl)
.then((res) => { 
    console.log('connected to db') 
    app.listen(PORT, () => {
        console.log('server is running')
    })
})
.catch((err) => { console.err("DB connection error", err) })