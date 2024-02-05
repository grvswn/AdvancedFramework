const express = require('express');
const { Product, Category } = require('../models');
const { createProductForm, bootstrapField } = require('../forms');

const router = express.Router();

router.get('/', async function(req,res){
    let products = await Product.collection().fetch({
        withRelated:['category']
    });
    res.render("products/index",{
        products: products.toJSON()
    });
});

router.get('/create', async function(req,res){
    const allCategories = await Category.fetchAll().map(category => [category.get('id'), category.get('name')]);

    const productForm = createProductForm(allCategories);
    res.render('products/create',{
        form: productForm.toHTML(bootstrapField)
    })
});

router.post('/create', async function(req,res){
    const allCategories = await Category.fetchAll().map(category => [category.get('id'), category.get('name')]);
    const productForm = createProductForm(allCategories);
    productForm.handle(req, {
        "success":async function(form) {
            const product = new Product();
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            product.set('category_id', form.data.category_id);
            await product.save();
            res.redirect('/products');

        },
        "error": function(form) {
            res.render('products/create',{
                form:form.toHTML(bootstrapField)
            })
        },
        "empty":function(form) {
            res.render('products/create',{
                form:form.toHTML(bootstrapField)
            })
        }
    })
});

router.get('/:product_id/update', async function(req,res){
    
    const allCategories = await Category.fetchAll().map(category => [category.get('id'), category.get('name')]);

   const product = await Product.where({
    'id': req.params.product_id
   }).fetch({
    require: true 
   }); 
   
   const productForm = createProductForm(allCategories);
   productForm.fields.name.value = product.get('name');
   productForm.fields.description.value = product.get('description');
   productForm.fields.cost.value = product.get('cost');
   productForm.fields.category_id.value = product.get('category_id');

   res.render('products/update',{
    form: productForm.toHTML(bootstrapField)
   });
});

router.post('/:product_id/update', async function(req,res){
    const allCategories = await Category.fetchAll().map(category => [category.get('id'), category.get('name')]);
    const productForm = createProductForm(allCategories);

    const product = await Product.where({
        id: req.params.product_id
    }).fetch({
        require: true
    })

    productForm.handle(req, {
        "success": async function(form) {
            product.set(form.data);
            await product.save();
            res.redirect('/products');
        },
        "error": async function(form) {
            res.render('products/update',{
                form: form.toHTML(bootstrapField)
            })
        },
        "empty":async function(form){
            res.render('products/update',{
                form: form.toHTML(bootstrapField)
            })
        }
    })
});

router.get('/:product_id/delete', async function(req,res){

    const product = await Product.where({
       'id': req.params.product_id
   }).fetch({
       require: true 
   }); 

   res.render('products/delete', {
       product: product.toJSON()
   })
});

router.post('/:product_id/delete', async function(req,res){
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true 
    }); 
    await product.destroy();
    res.redirect('/products');
});

module.exports = router;