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

const getMatched = async (userId, decors, types) => {
    const decorOpt = (decors.indexOf("pattern") > -1) ? 'solid' : 'pattern';
    const typesOpt = 
        (types[0] === "pants" || types[0] === "jeans" || types[0] === "skirt" || types[0] === "leggins")
            ? ['blouse', 't-shirt', 'long-sleeves', 'jacket', 'sweater', 'sweatshirt']
            : ['pants', 'jeans', 'skirt', 'leggins'];
        

    const filter = {
        $and: [
            {user: userId},
            {decors: decorOpt},
            {types: {$in: typesOpt}},
        ]
    };
    try {
        const items = await clothModel.find(
                    filter).limit(3).lean();
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

const updateOne = async (itemData, id) => {
    
    try {
        const item = await clothModel.findOneAndUpdate({ 
            _id: id },{ $set: {...itemData}},
            { new: true });
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
    getMatched,
    deleteItem
}