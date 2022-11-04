const clothModel = require('../db/models/Cloth.model');

const storeCloth = async (clothData) => {
    try{
        const newCloth = await clothModel.create(clothData)
        return newCloth;
    }catch(err){
        throw {
            msg: 'Failed to create new cloth, please check your input',
            code: 401
        }
    }
}

module.exports = {
    storeCloth
}