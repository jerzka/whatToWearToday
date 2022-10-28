require('dotenv').config();
const jwt = require('jsonwebtoken');

const createToken = async (userId) => {
    return await jwt.sign(
        { userId: userId},
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
    )
}

module.exports = {
    createToken
}