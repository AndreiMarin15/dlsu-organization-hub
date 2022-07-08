const express = require(`express`);
const controller = require("../controllers/controller");

const multer = require("multer");
const app = express();

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./views/images/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: Storage });

// test routes - to be deleted, DO NOT USE IN FRONTEND

// js functions

//feed
app.post("/like/:id", controller.likePost);
app.post("/save/:id", controller.savePost);
app.post("/going/:id", controller.going);
//index
app.get("/", controller.getIndex);
app.post("/search/", controller.search);
app.post("/search-org/", controller.searchOrg);

//delete
app.post("/delete-post/:id", controller.deletePost);
app.post("/delete-event/:id", controller.deleteEvent);

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
app.get("/saved-posts", controller.getStudentSavedPosts);
app.get("/saved-events", controller.getStudentSavedEvents);
app.get("/events-going", controller.getStudentGoing);

// STUDENT PROFILE
app.get("/student-profile", controller.getStudentProfile);
app.get("/student-profile/following", controller.getStudentFollowing);

// STUDENT SETTINGS
app.get("/student-settings", controller.getStudentSettings);
app.get("/student-edit-profile", controller.getUpdateProfile);
app.post("/student-edit-profile", controller.updateStudentProfile);
app.post("/update-student-profile", controller.updateStudentUser);

// STUDENT-VIEW ORG FEED AND PROFILE
app.get("/student-view-org/", controller.getOrgFeedStudentView);
app.get("/student-view-org/:id", controller.getOrgFeedStudentView);
app.get("/student-view-org-profile/:id", controller.getOrgProfileStudentView);
app.post("/student-view-org-profile/follow/:id", controller.followOrg);
app.post("/unfollow/:id", controller.unfollow);
//app.post("/student-view-org-profile/follow", controller.);

// ORG PROFILE
app.get("/org-profile", controller.getOrgProfile);

//ORG SIGN UP
app.get("/orgSignUp/", controller.getOrgSignUp);
app.post("/registerOrg", controller.addOrg);

//ORG FEED
app.get("/org-feed/", controller.getOrgFeed);
app.get("/org-feed/events", controller.getOrgFeedEvents);
app.get("/org-create-post", controller.getCreatePost);
app.get("/org-create-event", controller.getCreateEvent);

//ORG SETTINGS
app.get("/org-edit-profile", controller.getUpdateOrgProfile);
app.get("/org-settings", controller.getOrgSettings);
app.post("/org-edit-profile", upload.single("image"), controller.updateOrgProfile);
app.post("/update-org-profile", controller.updateOrgUser);

//ORG EDIT
app.get("/org-edit-post/:id", controller.getEditOrgPost);
app.get("/org-edit-event/:id", controller.getEditOrgEvent);
app.post("/update-post/:id", upload.single("postImage"), controller.updatePost);
app.post("/update-event/:id", upload.single("eventImage"), controller.updateEvent);

// STUDENT USERS
app.get("/studentUsers/", controller.getStudents);
app.post("/studentUsers/add", controller.addStudent);
app.post("/studentUsers/:id/follow", controller.addAffiliation);

//DELETE STUDENT ACCT.
app.post("/delete-student-profile/:id", controller.deleteStudentAccount);
app.get("/deleteStudent", controller.deleteStudent);

//DELETE ORG ACCT.
app.post("/delete-org-profile/:id", controller.deleteOrgAccount);
app.get("/deleteOrg", controller.deleteOrg);

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
app.post("/posts/update/:id", upload.single("postImage"), controller.updatePost);
app.post("/new-post", upload.single("postImage"), controller.addPost);
app.post("/new-event",upload.single("eventImage"), controller.addEvent);

// EVENTS
app.post("/events/add", controller.addEvent);

module.exports = app;
