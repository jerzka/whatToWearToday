const jwt = require('jsonwebtoken');
const SECRET_KEY = "SECRECT_KEY"

const auth = async (req, res, next) => {
    const cookies = req.cookies // read the cookies
        try {
            const verfied = await jwt.verify(cookies.token, SECRET_KEY) // verify token was created by us
            if(verfied && verfied.userId) { // make sure there is a user id embedded in the token 
                req.userId = verfied.userId // add user id to request object so controll doesnt need to deal with the cookie any more
                next() // call the next call back function
            } else {
                throw "invalid user"
            }
        } catch (error) {
            // if jwt throws error when verfying token, send to signin
            res.status(401).redirect('/signin')
            res.end()
            return;
        }

}

const createToken = async (userId) => {
    return await jwt.sign(
                {userId: userId},
                SECRET_KEY,
                { expiresIn: "1h" }
            )
}

module.exports = {
    auth, 
    createToken
}