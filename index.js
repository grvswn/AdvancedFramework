const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

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

const landingRoutes = require('./routes/landing.js');

async function main() {
    app.use('/', landingRoutes);
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});

