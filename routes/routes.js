const express = require(`express`);
const controller = require("../controllers/controller");

const app = express();

// test routes - to be deleted, DO NOT USE IN FRONTEND
app.post("/testPassword/:id", controller.bcryptTest);

//index
app.get("/", controller.getIndex);
app.get("/search/", controller.search);

// STUDENT USERS
app.get("/studentUsers/", controller.getStudents);
app.post("/studentUsers/add", controller.addStudent);
app.post("/studentUsers/:id/follow", controller.addAffiliation);

// ORG USERS
app.get("/orgUsers/", controller.getOrgs);
app.get("/orgUsers/:id", controller.getOrgs);
app.post("/orgUsers/add", controller.addOrg);
app.post("/orgUsers/update/:id", controller.updateOrgUser);

// POSTS

app.get("/posts/", controller.getPosts);
app.get("/posts/home/:id", controller.getPostsByAffiliations);
app.get("/posts/user/:id", controller.getPostsByUser);
app.post("/posts/add", controller.addPost);
app.get("/posts/:id", controller.getPostById);
app.delete("/posts/:id", controller.deletePost);
app.post("/posts/update/:id", controller.updatePost);

module.exports = app;
