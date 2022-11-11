const { ObjectId } = require('mongodb');
const { getConnection, Schema, mongoose } = require('../db');
getConnection();

const outfitModel = mongoose.model('Outfit', new mongoose.Schema({
    user:{
        type: ObjectId, 
        ref: 'User'    
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    availability: Boolean,
    createdAt: {
        type: Date, 
        default: Date.now
    },
    seasons: [{type: Object}],
    styles:Array,
    clothes: [{
        type: ObjectId, 
        ref: 'Cloth'    
    }],
    photo: {
        type: String,
        required: [true, "You need to upload a photo"],
    }
})
);

module.exports = outfitModel;
