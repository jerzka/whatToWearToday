const jwt = require('jsonwebtoken');
require('dotenv').config();
const { getUserById } = require('../controllers/user.controller')

const auth = async (req, res, next) => {
    const cookies = req.cookies;
        try {
            const verfied = await jwt.verify(cookies.token, process.env.SECRET_KEY);
            if(verfied && verfied.userId) {
                req.userId = verfied.userId;
                next();
            } else {
                throw "Invalid user";
            }
        } catch (error) {
            res.status(401).redirect('/signin');
            res.end();
            return;
        }

}

const adminGuard = async (req, res, next) =>{
    try{
    if(!req.userId){
        throw "User needs to login"
    }
    const user = await getUserById(req.userId);
    if(!user){
        throw "User not found";
    }
    if(user.userType === 0){
        next();
    } else{
        throw "User not authorized";
    }

}
catch (error){

}
}


module.exports = {
    auth, 
    adminGuard
}