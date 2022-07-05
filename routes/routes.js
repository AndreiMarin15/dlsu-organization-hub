const express = require(`express`);
const controller = require("../controllers/controller");

const multer = require("multer");
const app = express();




// test routes - to be deleted, DO NOT USE IN FRONTEND


// js functions

//index
app.get("/", controller.getIndex);
app.get("/search/", controller.search);

//LOG IN
app.get("/logIn", controller.getLogIn);
app.post("/loginForm", controller.logIn);
app.get("/validateLog", controller.validateLogIn);

//LOG OUT
app.get("/logout", controller.logout);

//USER VERIF
app.get("/userVerif", controller.getUserVerif);

//STUDENT SIGN UP
app.get("/studentSignUp", controller.getStudentSignUp);
app.post("/register", controller.addStudent);

//STUDENT FEED
app.get("/student-feed/", controller.getStudentFeed);

//ORG SIGN UP
app.get("/orgSignUp/", controller.getOrgSignUp);
app.post("/registerOrg", controller.addOrg);
//ORG FEED
app.get("/org-feed/", controller.getOrgFeed);

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

// EVENTS
app.post("/events/add", controller.addEvent);


module.exports = app;
