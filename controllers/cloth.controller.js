const clothModel = require('..db/models/Cloth.model');

const storeCloth = async (clothData) => {
    try{
        const cloth = new clothModel({
            clothData
        });
        await cloth.save();
        return;
    }catch(err){
        throw {
            msg: 'Failed to create new cloth, please check your input',
            code: 400
        }
    }
}

module.exports = {
    storeCloth
}