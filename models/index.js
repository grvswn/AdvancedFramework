const bookshelf = require('../bookshelf');

const Product = bookshelf.model('Product',{
    tableName:'products',
    category() {
        return this.belongsTo('Category')
    },
    tags:function() {
        return this.belongsToMany('Tag');
    }
});

const Category = bookshelf.model('Category',{
    tableName:'categories',
    products() {
        return this.hasMany('Product');
    }
});

const Tag = bookshelf.model("Tag",{
    tableName:'tags',
    products:function() {
        return this.belongsToMany('Product')
    }
});

const User = bookshelf.model('User',{
    tableName: 'users'
});

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    product() {
        return this.belongsTo('Product')
    }
});

module.exports = {
    Product, Category, Tag, User, CartItem
};