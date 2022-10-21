const userModel = require('../db/models/User.model');
const bcrypt = require('bcryptjs');

const storeUser = async (userData) => {
    //const user = new userModel(userData);
    try {
        console.log("from storeUser "+userData.password);
        const password = await bcrypt.hashSync(userData.password, 10);
        console.log("po szyfrowaniu "+password);
        const user = new userModel({
            ...userData, 
            password
        });
        console.log("user to model "+ user);
        await user.save();
    } catch(err) {
        throw {
            msg: 'failed to create user, please check your input',
            code: 400
        }
    }
}

module.exports = {
    storeUser
}