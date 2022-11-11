const clothModel = require('../db/models/Cloth.model');

const storeCloth = async (clothData) => {
    try{
        const newCloth = await clothModel.create(clothData);
        return newCloth;
    }catch(err){
        throw {
            msg: 'Failed to create new cloth, please check your input',
            code: 401
        }
    }
}

const getClothById = async (clothId) => {
    try {
        const cloth = await clothModel.findOne({
            _id: clothId
        }).lean();
        return cloth;
    } catch (error) {
        throw {
            msg: 'unable to find cloth',
            code: 400
        }
    }
}

module.exports = {
    storeCloth,
    getClothById
}