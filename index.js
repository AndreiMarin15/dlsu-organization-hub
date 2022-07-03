//hi goiz
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const hbs = require("hbs");
const routes = require("./routes/routes.js")
const path = require("path");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const url = "mongodb://localhost:27017/dlsu-organization-hub"; // database creation || selection

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};


hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper("ifIn", function (elem, list, options) {
    if (list.indexOf(elem) > -1) {
        return options.fn(this);
    }
    return options.inverse(this);
});

app.use(express.static(path.join(__dirname, "views")));

app.set("view engine", "hbs");

hbs.registerPartials(__dirname + `/views/partials`);


mongoose.connect(url, options);
const connection = mongoose.connection;

connection.once("open", () => {
    console.log(`MongoDB Connection Established on: ${url}`);
});



app.use("/", routes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
