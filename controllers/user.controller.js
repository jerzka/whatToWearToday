const userModel = require('../db/models/User.model');
const bcrypt = require('bcryptjs');
const { createToken } = require('../middelwares/auth');

const storeUser = async (userData) => {

    try {
        const password = await bcrypt.hashSync(userData.password, 10)
        const user = new userModel({
            ...userData,
            password
        })
        await user.save();
        return;
    } catch(err) {
        throw {
            msg: 'failed to create user, please check your input', 
            code: 400 
        }
    }
}

const getUser = async (email) => {
    try {
        const user = await userModel.findOne({
            email: email
        })
        return user;
    } catch (error) {
        throw {
            msg: 'unable to find user',
            code: 400
        }
    }

}

const getUserById = async (userId) => {
    try {
        const user = await userModel.findOne({
            _id: userId
        });
        return user
    } catch (error) {
        throw {
            msg: 'unable to find user',
            code: 400
        }
    }
}

const signin = async (userData) => {
        const user = await getUser(userData.email)
        if (!user) {
            throw {
                msg: "Invalid login iformation", 
                code: 404
            }
        }
        const passwordMatch = await bcrypt.compareSync(userData.password, user.password)
        if(!passwordMatch) {
            throw {
                msg: "Invalid login information", 
                code: 401
            }
        }
        const token = await createToken(user.id)
        return { 
            userId: user.id,
            token
        }
}
module.exports = {
    storeUser,
    getUser,
    signin,
    getUserById
}