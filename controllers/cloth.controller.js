const clothModel = require('../db/models/Cloth.model');

const store = async (clothData) => {
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

const getById = async (clothId) => {
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

const getByUserId = async (userId) => {
    try {
        const clothes = await clothModel.find({
            user: userId
        }).lean();
        if(!clothes) { 
            throw {
                msg: 'unable to find any cloth',
                code: 400
            }
        }
        else if(clothes === 0){
//            return;
        }
        return clothes;
    } catch (error) {
        throw {
            msg: 'unable to find cloth',
            code: 400
        }
    }
}

const getBySearchText = async (searchText) => {
    try {
        const clothes = await clothModel.find({ 
            $text: { $search: searchText }}).lean();
        if(!clothes || clothes.length === 0) { 
            throw {
                msg: 'unable to find any cloth',
                code: 400
            }
        }
        return clothes;
    } catch (error) {
        throw {
            msg: 'unable to find cloth',
            code: 400
        }
    }
}

const updateOne = async (cloth) => {
    const filter = { _id: cloth.id};
    const update = { name: cloth.name,
                    availability: cloth.availability,
                    seasons: cloth.seasons,
                    styles: cloth.styles,
                    //image: cloth.photo,
                    colors: cloth.colors,
                    fabrics: cloth.fabrics
    };
    
    try {
        const cloth = await clothModel.findOneAndUpdate(filter, update, 
            {new: true}).lean();
        return cloth;
    } catch (error) {
        throw {
            msg: 'unable to find cloth',
            code: 400
        }
    }
}

module.exports = {
    store,
    getById,
    updateOne,
    getByUserId,
    getBySearchText
}