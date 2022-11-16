const mongoose = require('mongoose');
require('dotenv').config();
const { initializeApp } = require('firebase/app');

let connection = undefined;
let storage= undefined;

const getConnection = async() =>{
    if(connection) {
        console.log("returning existing connection");
        return connection;
    }
    else{
        console.log("create new connection")
        connection = await mongoose.connect(process.env.API_KEY);
        return connection;
    }
}

const initializeFirebase = async () =>{
    const firebaseConfig = {
        apiKey: process.env.FIRE_API_KEY,
        authDomain: process.env.FIRE_AUTH_DOMAIN,
        projectId: process.env.FIRE_PROJECT_ID,
        storageBucket: process.env.FIRE_BUCKET_URL,
        appId: process.env.FIRE_APP_ID
      };
      
    if(storage) {
        console.log("returning existing storage connection");
        return app;
    }
    else{
        console.log("create new storage connection")
        app = await initializeApp(firebaseConfig);
        return app;
    }
}

module.exports = {
    getConnection, 
    mongoose, 
    Schema: mongoose.Schema,
    initializeFirebase
};