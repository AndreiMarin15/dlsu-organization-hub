//hi goiz
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const hbs = require("hbs");
const routes = require("./routes/routes.js");
const path = require("path");
const bodyParser = require("body-parser");

const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const test = "test";
const official = "dlsu-org-hub";

const url = `mongodb+srv://admin:00000000@dlsu-organization-hub.lrjh1.mongodb.net/${test}?retryWrites=true&w=majority`; // database creation || selection

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

const store = new MongoDBSession({
    uri: url,
    collection: "Sessions",
});

app.use(
    session({
        secret: "database",
        resave: false,
        saveUninitialized: false,
        store: store,
        expires: new Date(Date.now() + 864000000),
        maxAge: new Date(Date.now() + 864000000),
    })
);

app.use("/", routes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
