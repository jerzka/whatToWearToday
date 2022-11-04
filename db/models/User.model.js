const { ObjectId } = require('mongodb');
const { getConnection, Schema, mongoose } = require('../db');
getConnection();

const userModel = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^\S+@\S+$/g, 'invalid email format'],
        min: 4,
        max: 255
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        min: 8,
        max: 255
    },
    clothes: [{
        type: ObjectId, 
        ref: 'Cloth'    
    }]
    // ,
    // outfits: [{
    //     outfit_id: ObjectId
    // }]
})
);

module.exports = userModel;