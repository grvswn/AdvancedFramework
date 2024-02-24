const express = require("express");
const router = express.Router();

const cart = require('../services/cart_services');

router.get('/', async(req,res)=>{
    res.render('cart/index', {
        'shoppingCart': (await cart.getCart(req.session.user.id)).toJSON()
    });
});

router.get('/:product_id/add', async (req,res)=>{
    await cart.addToCart(req.session.user.id, req.params.product_id, 1);
    req.flash('success_messages', 'Item successfully added to cart');
    res.redirect('/products');
});

router.get('/:product_id/remove', async(req,res)=>{
    await cart.removeFromCart(req.session.user.id, req.params.product_id);
    req.flash("success_messages", "Item has been removed");
    res.redirect('/cart/');
});

router.post('/:product_id/quantity/update', async(req,res)=>{
    await cart.updateQuantity(req.session.user.id, req.params.product_id, req.body.newQuantity);
    req.flash("success_messages", "Quantity updated")
    res.redirect('/cart/');
});

module.exports = router;