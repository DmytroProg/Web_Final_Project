const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collerSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    owner:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    power:{
        type: Number,
        required: true
    },
    loud:{
        type: Number,
        required: true
    },
    material:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
}, { timestamps: true })

const CollerModel = mongoose.model('CollerModel', collerSchema)
module.exports = CollerModel