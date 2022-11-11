const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
    const cookies = req.cookies;
        try {
            const verfied = await jwt.verify(cookies.token, process.env.SECRET_KEY);
            if(verfied && verfied.userId) {
                req.userId = verfied.userId;
                req.userName = cookies.userName;
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

const authGuard = async (req, res, next) => {
    const cookies = req.cookies;
    try {
        if (!cookies || !cookies.token) {
            throw "User not authorized";
        }
        const data = await verifyToken(cookies.token);
        req.userId = data.userId;
        next();
    }
    catch (error) {
        res.redirect('/signin');
        res.end();
    }
}

module.exports = {
    auth,
    authGuard
}