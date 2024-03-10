const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const csrf = require('csurf');

const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

let app = express();

app.set("view engine", "hbs");
app.use(express.static("public"));
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(session({
  store: new FileStore(),
  secret: process.env.SESSIONS_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

app.use(function(req,res,next){
  if (req.session.user.username) {
    res.locals.userName = req.session.user.username;
  }
  next();
});

const csrfInstance = csrf();
app.use(function(req,res,next){
  if (req.url === "/checkout/process_payment" || req.url.slice(0,5)=="/api/") {
    return next();
  }
  csrfInstance(req,res,next);
});

app.use(function(req,res,next){
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  };
  next();
});

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
      req.flash('error_messages', 'The form has expired. Please try again');
      res.redirect('back');
  } else {
      next();
  }
});

const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cloudinaryRoutes = require('./routes/cloudinary');
const cartRoutes = require('./routes/shoppingCart');
const checkoutRoutes = require('./routes/checkout');
const api = {
  products: require('./routes/api/products')
};

async function main() {
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
    app.use('/cart', cartRoutes);
    app.use('/checkout', checkoutRoutes);
    app.use('/api/products', express.json(), api.products);
};

main();

app.listen(3000, () => {
  console.log("Server has started");
});