const express = require('express')
const router = express.Router();

const dataLayer = require('../../dal/products');

const { Product } = require('../../models');
const { createProductForm } = require('../../forms');

router.get('/', async(req,res)=>{
    res.send(await dataLayer.getAllProducts())
});

router.get('/:product_id', async(req,res)=>{
    const productId = req.params.product_id;
    const product = await dataLayer.getProductByID(productId);
    res.send(product);
});

router.post('/', async (req, res) => {
    const allCategories = await dataLayer.getAllCategories();
    const allTags = await dataLayer.getAllTags();
    const productForm = createProductForm(allCategories, allTags);

    productForm.handle(req, {
        'success': async (form) => {                    
            let { tags, ...productData } = form.data;
            const product = new Product(productData);
            await product.save();
    
            if (tags) {
                await product.tags().attach(tags.split(","));
            }
            res.send(product);
        },
        'error': async (form) => {
           let errors = {};
           for (let key in form.fields) {
               if (form.fields[key].error) {
                   errors[key] = form.fields[key].error;
               }
           }
           res.send(JSON.stringify(errors));
        }
    });
});

router.put('/:product_id', async(req,res)=>{
    const allTags = await dataLayer.getAllTags();
    const allCategories = await dataLayer.getAllCategories();
    const productForm = createProductForm(allCategories, allTags);
    
    const productId = req.params.product_id;
    const product = await dataLayer.getProductByID(productId);
    
    productForm.handle(req, {
        "success": async function(form) {
            let {tags, ...productData} = form.data;
            product.set(productData);
            await product.save();

            let tagIds = tags.split(",");

            const existingTagIds = await product.related('tags').pluck('id');
            await product.tags().detach(existingTagIds);
            
            let toRemove = existingTagIds.filter( id => tagIds.includes(id) === false);
            await product.tags().detach(toRemove);

            await product.tags().attach(tagIds);

            res.send(product);
        },
        'error': async (form) => {
            let errors = {};
            for (let key in form.fields) {
                if (form.fields[key].error) {
                    errors[key] = form.fields[key].error;
                }
            }
            res.send(JSON.stringify(errors));
        }
    });
});

router.delete('/:product_id', async(req,res)=>{
    const productId = req.params.product_id;
    const product = await dataLayer.getProductByID(productId);

    await product.destroy();

    res.send(product);
});

module.exports = router;