const { ObjectId } = require('mongodb');
const { getConnection, Schema, mongoose } = require('../db');
getConnection();

const outfitModel = mongoose.model('Outfit', new mongoose.Schema({
    user:{
        type: ObjectId, 
        ref: 'User'    
    },
    name: String,
    title: {
        type: String,
        required: [true, "Outfit title is required"],
    },
    availability: Boolean,
    privacy: Boolean,
    rating:{
        type: Number, 
        default: 0 
    },
    seasons: Array,
    occasions: Array,
    clothes: [{
        type: ObjectId, 
        ref: 'Cloth'    
    }],
    photo: {
        type: String,
        required: [true, "You need to save an outfit"],
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    }
})
);

module.exports = outfitModel;

// db.outfits.insertOne({
//     user: _id,
//     name: "Meeting with friend",
//     availability: true,
//     privacy: false,
//     createdAt: "2022-11-19 9:05",
//     seasons: ["spring" , "summer"],
//     styles: ["casual", "outdoor"],
//     clothes: [{"63654e79c739477cfd0e9c02"},
//               {"636550a7a6b0f0c04fabdecc"}],
//     photo: {"https://firebasestorage.googleapis.com/v0/b/what-to-wear-today-f3d84.appspot.com/o/upload%2Foutfit1.png?alt=media&token=9e1a08bd-1647-402b-8881-4999a798db91"}
// });
