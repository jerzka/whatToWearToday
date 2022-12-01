const clothModel = require('../db/models/Cloth.model');

const store = async (itemData) => {
    try {
        const newItem = await clothModel.create(itemData);
        return newItem;
    } catch (err) {
        throw {
            msg: 'Failed to create new cloth, please check your input',
            code: 401
        }
    }
}

const getById = async (itemId) => {
    try {
        const item = await clothModel.findOne({
            _id: itemId
        }).lean();
        return item;
    } catch (error) {
        throw {
            msg: 'unable to find cloth',
            code: 400
        }
    }
}

const getByUserId = async (userId) => {
    try {
        const items = await clothModel.find({
            user: userId
        }).lean();
        if (!items) {
            throw {
                msg: 'unable to find any cloth',
                code: 400
            }
        }
        else if (items.length === 0) {
            return;
        }
        return items;
    } catch (error) {
        throw {
            msg: 'unable to find cloth',
            code: 400
        }
    }
}

const getBySearchText = async (searchText) => {
    try {
        const items = await clothModel.find({
            $text: { $search: searchText }
        }).lean();
        if (!items) {
            throw {
                msg: 'unable to find any cloth',
                code: 400
            }
        }
        else if (items.length === 0) {
            return;
        }
        return items;
    } catch (error) {
        throw {
            msg: 'unable to find cloth',
            code: 400
        }
    }
}

const updateOne = async (item) => {
    
    try {
        const item = await clothModel.findOneAndUpdate({ 
            _id: item.id },
            {
                name: item.name,
                availability: item.availability,
                seasons: item.seasons,
                styles: item.styles,
                image: item.photo,
                colors: item.colors,
                fabrics: item.fabrics
            },
            { new: true }).lean();
        return item;
    } catch (error) {
        throw {
            msg: 'unable to find cloth',
            code: 400
        }
    }
}

const deleteItem = async (id) => {
    try{
        await clothModel.deleteOne({
            _id: id
        })
    } catch (error){
        throw {
            msg: 'unable to delete cloth',
            code: 400
        }
    }
}

module.exports = {
    store,
    getById,
    updateOne,
    getByUserId,
    getBySearchText,
    deleteItem
}