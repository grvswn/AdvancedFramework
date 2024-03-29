const { Product, Category, Tag } = require('../models');

const getAllCategories = async () => {
    return await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')];
    });
};

const getAllTags = async () => {
    return await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);
};

const getProductByID = async (productId) => {
    return await Product.where({
        'id': parseInt(productId)
    }).fetch({
        require: true,
        withRelated: ['tags', 'category']
    });
};

const getAllProducts = async () => {
    return await Product.fetchAll();
};

module.exports = {
    getAllCategories, getAllTags, getProductByID, getAllProducts
};