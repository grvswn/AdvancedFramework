const express = require('express');
const { Product } = require('../models');
const router = express.Router();

router.get('/', async function(req,res){
    let products = await Product.collection().fetch();
    res.render("products/index",{
        products: products.toJSON()
    });
});

module.exports = router;