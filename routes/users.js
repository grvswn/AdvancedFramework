const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();

const { User } = require('../models');

const { createRegistrationForm, createLoginForm, bootstrapField } = require('../forms');

router.get('/register', (req,res)=>{
    const registerForm = createRegistrationForm();
    res.render('users/register', {
        'form': registerForm.toHTML(bootstrapField)
    })
});

router.post('/register', (req, res) => {
    const registerForm = createRegistrationForm();
    registerForm.handle(req, {
        success: async (form) => {
            const user = new User({
                'username': form.data.username,
                'password': await bcrypt.hash(form.data.password, 10),
                'email': form.data.email
            });
            await user.save();
            req.flash("success_messages", "User signed up successfully!");
            res.redirect('/users/login');
        },
        'error': (form) => {
            res.render('users/register', {
                'form': form.toHTML(bootstrapField)
            });
        }
    });
});

router.get('/login', (req,res)=>{
    const loginForm = createLoginForm();
    res.render('users/login',{
        'form': loginForm.toHTML(bootstrapField)
    })
});

router.post('/login', async (req, res) => {
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        'success': async (form) => {
            let user = await User.where({
                'email': form.data.email
            }).fetch({
               require:false}
            );

            if (!user) {
                req.flash("error_messages", "Sorry, the user details you provided does not exist.")
                res.redirect('/users/login');
            } else {
                if (await bcrypt.compare(form.data.password, user.get("password"))) {
        
                    req.session.user = {
                        id: user.get('id'),
                        username: user.get('username'),
                        email: user.get('email')
                    }
                    req.flash("success_messages", "Welcome back, " + user.get('username'));
                    res.redirect('/users/profile');
                } else {
                    req.flash("error_messages", "Sorry, the authentication details are incorrect.")
                    res.redirect('/users/login')
                }
            }
        }, 'error': (form) => {
            req.flash("error_messages", "There are some problems logging you in. Please fill in the form again")
            res.render('users/login', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
});

router.get('/profile', (req, res) => {
    const user = req.session.user;
    if (!user) {
        req.flash('error_messages', 'Log in to view this page');
        res.redirect('/users/login');
    } else {
        res.render('users/profile',{
            'user': user
        })
    }
});

router.get('/logout', (req, res) => {
    req.session.user = null;
    req.flash('success_messages', "See you again!");
    res.redirect('/users/login');
});

module.exports = router;