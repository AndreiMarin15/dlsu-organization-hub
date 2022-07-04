const express = require(`express`);
const controller = require("../controllers/controller");

const app = express();

// test routes - to be deleted, DO NOT USE IN FRONTEND
app.post("/testPassword/:id", controller.bcryptTest);

//index
app.get("/", controller.getIndex);
app.get("/search/", controller.search);

//LOG IN 
app.get("/logIn", controller.getLogIn);
app.post("/loginForm", controller.logInStudent);
app.get("/validateLog", controller.validateLogIn);

//LOG OUT
app.post("/logout/", controller.logout);

//USER VERIF
app.get("/userVerif/", controller.getUserVerif);

//STUDENT SIGN UP
app.get("/studentSignUp/", controller.getStudentSignUp);

//STUDENT FEED
app.get("/feed/", controller.getFeed);

//ORG SIGN UP
app.get("/orgSignUp/", controller.getOrgSignUp);

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
