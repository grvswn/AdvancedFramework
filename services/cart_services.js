const cartDataLayer = require('../dal/cart_items');

async function addToCart(userId, productId, quantity) {
    const cartItem = await cartDataLayer.getCartItemByUserAndProduct(userId, productId);
    if (!cartItem) {
        await cartDataLayer.createCartItem(userId, productId, quantity);
    } else {
        await cartDataLayer.updateQuantityRelative(userId, productId, 1);
    };
};

async function removeFromCart(userId, productId) {
    return await cartDataLayer.removeFromCart(userId, productId);
};

async function updateQuantity(userId, productId, newQuantity) {
    return await cartDataLayer.updateQuantity(userId, productId, newQuantity);
};

async function getCart(userId) {
    return await cartDataLayer.getCart(userId);
};

module.exports = { addToCart, removeFromCart, updateQuantity, getCart };
