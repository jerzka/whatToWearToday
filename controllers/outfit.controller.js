const outfitModel = require('../db/models/Outfit.model');

const store = async (itemData) => {
    try {
        const newItem = await outfitModel.create(itemData);
        return newItem;
    } catch (err) {
        throw {
            msg: 'Failed to create new outfit, please check your input',
            code: 401
        }
    }
}

const getAll = async () => {
    try {
        const items = await outfitModel.find({}).lean()
        return items;
    } catch (error) {
        throw {
            msg: 'unable to find any outfit',
            code: 400
        }
    }
}
const getById = async (itemId) => {
    try {
        const item = await outfitModel.findOne({
            _id: itemId
        }).lean();
        return item;
    } catch (error) {
        throw {
            msg: 'unable to find outfit',
            code: 400
        }
    }
}

const getByUserId = async (userId) => {
    try {
        const items = await outfitModel.find({
            user: userId
        }).lean();
        if (!items) {
            throw {
                msg: 'unable to find any outfit',
                code: 400
            }
        }
        else if (items.length === 0) {
            return;
        }
        return items;
    } catch (error) {
        throw {
            msg: 'unable to find outfit',
            code: 400
        }
    }
}

const updateOne = async (item) => {
    const filter = { _id: item.id };
    const update = {
        name: item.name,
        privacy: item.privacy,
        seasons: item.seasons,
        categories: item.categories,
        image: item.photo,
        clothes: item.clothes,
        rating: item.rating
    };

    try {
        const item = await outfitModel.findOneAndUpdate(filter, update,
            { new: true }).lean();
        return item;
    } catch (error) {
        throw {
            msg: 'unable to find outfit',
            code: 400
        }
    }
}

module.exports = {
    store,
    getAll,
    getById,
    updateOne,
    getByUserId
}