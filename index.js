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
  secret: process.env.SESSIONS_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

app.use(csrf());
app.use(function(req,res,next){
  res.locals.csrfToken = req.csrfToken();
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

const landingRoutes = require('./routes/landing.js');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cloudinaryRoutes = require('./routes/cloudinary.js');

async function main() {
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
};

main();

app.listen(3000, () => {
  console.log("Server has started");
});