const express = require(`express`);
const controller = require("../controllers/controller");

const multer = require("multer");
const app = express();




// test routes - to be deleted, DO NOT USE IN FRONTEND


// js functions

//feed
app.post("/like/:id", controller.likePost);
app.post("/save/:id", controller.savePost);
app.post("/going/:id", controller.going);
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
app.get("/student-feed/", controller.getStudentFeedPosts);
app.get("/student-feed/events", controller.getStudentFeedEvents);

// STUDENT PROFILE
app.get("/student-profile", controller.getStudentProfile);


// STUDENT SETTINGS
app.get("/student-settings", controller.getStudentSettings);
app.get("/student-edit-profile", controller.getUpdateProfile);
app.post("/student-edit-profile", controller.updateStudentProfile);
app.post("/update-student-profile", controller.updateStudentUser);

// STUDENT-VIEW ORG FEED AND PROFILE
app.get("/student-view-org", controller.getOrgFeedStudentView);
app.get("/student-view-org-profile", controller.getOrgProfileStudentView);

// ORG PROFILE
app.get("/org-profile", controller.getOrgProfile);
 
//ORG SIGN UP
app.get("/orgSignUp/", controller.getOrgSignUp);
app.post("/registerOrg", controller.addOrg);

//ORG FEED
app.get("/org-feed/", controller.getOrgFeedPosts);
app.get("/org-feed/events", controller.getOrgFeedEvents);
app.get("/org-create-post", controller.getCreatePost);
app.get("/org-create-event", controller.getCreateEvent);

//ORG SETTINGS
app.get("/org-edit-profile", controller.getUpdateOrgProfile);
app.get("/org-settings", controller.getOrgSettings);

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
app.get("/posts/home/following", controller.getPostsByAffiliations);
app.get("/posts/user/:id", controller.getPostsByUser);
app.post("/posts/add", controller.addPost);
app.get("/posts/:id", controller.getPostById);
app.delete("/posts/:id", controller.deletePost);
app.post("/posts/update/:id", controller.updatePost);

// EVENTS
app.post("/events/add", controller.addEvent);


module.exports = app;
