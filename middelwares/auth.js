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

module.exports = {
    auth
}