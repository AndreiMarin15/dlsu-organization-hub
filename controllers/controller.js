const StudentUser = require("../models/studentUserModel");
const OrgUser = require("../models/orgUserModel");
const Posts = require("../models/postModel");
const Event = require("../models/eventModel");
const Image = require("../models/imageModel");
const bcrypt = require("bcrypt");
const Events = require("../models/eventModel");

/* POSSIBLE CHANGES (once frontend is implemented):
    - Some req.___ might need to be changed depending on front end
    - Getting parameteres such as userid may be changed to username if needed
    - responses(res.jsons) -> res.send or res.render
    - optimize for using handlebars
*/

var studentUser = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    program: "",
    college: "",
    idNumber: "",
};

var orgUser = {
    email: "",
    password: "",
    name: "",
};

const controller = {
    // test functions - to be deleted, DO NOT USE IN FRONTEND

    // general
    validateLogIn: function (req, res) {
        StudentUser.findOne({ email: req.query.email })
            .then((studentuser) => {
                if (studentuser) {
                    bcrypt.compare(
                        req.query.password,
                        studentuser.password,
                        function (error, isVerify) {
                           
                            res.send(isVerify);
                        }
                    );
                } else {
                    OrgUser.findOne({ email: req.query.email }).then((orguser) => {
                        if (orguser) {
                            bcrypt.compare(
                                req.query.password,
                                orguser.password,
                                function (error, isVerify) {
                                    res.send(isVerify);
                                }
                            );
                        } else {
                            res.send(false);
                        }
                    });
                }
            })
            .catch((err) => res.json(err));
    },

    getIndex: (req, res) => {
        res.render("index");
    },

    getLogIn: (req, res) => {
        if (req.session.userid) {
            if (req.session.usertype == "student") {
                res.redirect("/student-feed");
            } else {
                res.redirect("/org-feed");
            }
        } else {
            res.render("log_in");
        }
    },

    getUserVerif: (req, res) => {
        res.render("userVerificationSignUp");
    },

    getStudentSignUp: (req, res) => {
        res.render("student_sign_up");
    },

    getOrgSignUp: (req, res) => {
        res.render("org_sign_up");
    },

    getCreatePost: (req, res) => {
        res.render("org_create_post");
    },

    getCreateEvent: (req, res) => {
        res.render("org_create_event");
    },

    likePost: (req, res) => {
        Posts.findById(req.params.id).then((post) => {
            if (post != null) {
                if (post.likes.indexOf(req.session.userid) == -1 || post.likes == null) {
                    post.likes.push(req.session.userid);

                    post.save();

                    res.redirect("/student-feed/");
                } else {
                    index = post.likes.indexOf(req.session.userid);

                    post.likes.splice(index, 1);

                    post.save();
                    res.redirect("/student-feed/");
                }
            } else {
                Events.findById(req.params.id).then((event) => {
                    if (event.likes.indexOf(req.session.userid) == -1 || event.likes == null) {
                        event.likes.push(req.session.userid);

                        event.save();

                        res.redirect("/student-feed/events");
                    } else {
                        index = event.likes.indexOf(req.session.userid);

                        event.likes.splice(index, 1);

                        event.save();
                        res.redirect("/student-feed/events");
                    }
                });
            }
        });
    },

    savePost: (req, res) => {
        StudentUser.findById(req.session.userid).then((student) => {
            Posts.findById(req.params.id).then((post) => {
                if (post) {
                    if (student.saved.indexOf(post._id) == -1 || student.saved == null) {
                        student.saved.push(post._id);

                        student.save();

                        res.redirect("/student-feed/");
                    } else {
                        index = student.saved.indexOf(post._id);

                        student.saved.splice(index, 1);

                        student.save();

                        res.redirect("/student-feed/");
                    }
                } else {
                    Events.findById(req.params.id).then((event) => {
                        if (student.saved.indexOf(event._id) == -1 || student.saved == null) {
                            student.saved.push(event._id);

                            student.save();

                            res.redirect("/student-feed/events");
                        } else {
                            index = student.saved.indexOf(event._id);

                            student.saved.splice(index, 1);

                            student.save();

                            res.redirect("/student-feed/events");
                        }
                    });
                }
            });
        });
    },

    going: (req, res) => {
        StudentUser.findById(req.session.userid).then((student) => {
            Events.findById(req.params.id).then((event) => {
                if (student.going.indexOf(event._id) == -1 || student.going == null) {
                    student.going.push(event._id);

                    student.save();

                    res.redirect("/student-feed/events");
                } else {
                    index = student.going.indexOf(event._id);

                    student.going.splice(index, 1);

                    student.save();

                    res.redirect("/student-feed/events");
                }
            });
        });
    },

    getStudentFeed: (req, res) => {
        Posts.find().then((posts) => {
            Event.find()
                .then((events) => {
                    res.render("student_feed", { user: studentUser, post: posts, event: events });
                })
                .catch((err) => console.log(err));
        });
    },

    getStudentProfile: (req, res) => {
        res.render("student_profile", { user: studentUser });
    },

    getStudentSettings: (req, res) => {
        res.render("student_settings", { user: studentUser });
    },

    getUpdateProfile: (req, res) => {
        res.render("student_edit_profile", { user: studentUser });
    },

    
    getOrgFeedStudentView: (req, res) => {
        res.render("student_org_feed"); 
    },

    getOrgProfileStudentView: (req, res) => {
        res.render("student_org_profile");
    },

    getOrgFeed: (req, res) => {
        Posts.find().then((posts) => {
            Event.find()
                .then((events) => {
                    res.render("org_feed", { user: orgUser, post: posts, event: events });
                })
                .catch((err) => console.log(err));
        });
    },

    getOrgProfile: (req, res) => {
        res.render("org_profile", { user: orgUser });
    },

    getUpdateOrgProfile: (req, res) => {
        res.render("org_edit_profile", { user: orgUser });
    },

    getOrgSettings: (req, res) => {
        res.render("org_settings", { user: orgUser });
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) throw err;
            res.redirect("/");
        });
    },

    search: (req, res) => {
        // searches for an org user through the org name, if the inital find method returns a blank array, it searches for posts matching its content
        OrgUser.find({ name: { $regex: ".*" + req.body.search + ".*" } }, (err, user) => {
            if (err) {
                res.status(400).json("Error: " + err);
            }

            if (!user.length) {
                Posts.find({ content: { $regex: ".*" + req.body.search + ".*" } }, (err, post) => {
                    if (err) {
                        res.status(400).json("Error: " + err);
                    }

                    if (!post.length) {
                        Event.find({ content: { $regex: ".*" + req.body.search + ".*" } })
                            .then((event) => {
                                res.json(event);
                            })
                            .catch((err) => res.status(400).json("Error: ") + err);
                    } else {
                        res.json(post);
                    }
                });
            } else {
                res.json(user);
            }
        });
    },

    logIn: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        req.session.email = email;
        req.session.password = password;    

        OrgUser.findOne({ email: email }).then((orguser) => {
            if (orguser != null) {
                bcrypt.compare(password, orguser.password).then((isVerify) => {
                    if (isVerify) {
                        req.session.email = orguser.email;
                        req.session.userid = orguser._id;
                        req.session.name = orguser.name;
                        req.session.usertype = "org";

                        req.session.save();

                        let login = {
                            email: orguser.email,
                            password: orguser.password,
                            name: orguser.name,
                        };

                        orgUser = login;

                        res.redirect("/org-feed");
                    }
                });
            } else {
                StudentUser.findOne({ email: email }).then((studentuser) => {
                    if (studentuser != null) {
                        bcrypt.compare(password, studentuser.password).then((isVerify) => {
                            if (isVerify) {
                                req.session.email = studentuser.email;
                                req.session.userid = studentuser._id;
                                req.session.firstName = studentuser.firstName;
                                req.session.lastName = studentuser.lastName;
                                req.session.usertype = "student";

                                req.session.save();
                                var login = {
                                    email: studentuser.email,
                                    password: studentuser.password,
                                    firstName: studentuser.firstName,
                                    lastName: studentuser.lastName,
                                    program: studentuser.program,
                                    college: studentuser.college,
                                    idNumber: studentuser.idNumber,
                                };

                                studentUser = login;

                                res.redirect("/student-feed");
                            } else {
                                res.redirect("/logIn");
                            }
                        });
                    } else {
                        console.log("Not found");
                        res.redirect("/logIn");
                    }
                });
            }
        });
    },

    // studentUserModel
    getStudents: (req, res) => {
        // gets the details of all student users
        StudentUser.find()
            .then((studentusers) => res.json(studentusers))
            .catch((err) => res.status(400).json("Error: " + err));
    },

    addStudent: (req, res) => {
        // adds a new student to the database
        const email = req.body.email;
        const password = req.body.password;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const confirm = req.body.confirmPassword;

        

        StudentUser.findOne({ email: email }).then((studentuser) => {
            if (studentuser == null) {
                if (password === confirm && password.length >= 8 && email.includes("dlsu.edu.ph")) {
                    const newStudentUser = new StudentUser({
                        firstName,
                        lastName,
                        email,
                        password,
                    });

                    newStudentUser
                        .save()
                        .then(() => {
                            res.send(
                                `<script>alert("Account Created"); window.location.href = "/login"; </script>`
                            );
                        })
                        .catch((err) => res.status(400).json("Error: " + err));
                } else {
                    res.send(
                        `<script>alert("Invalid Credentials. Double check your email and password."); window.location.href = "/studentSignUp"; </script>`
                    );
                }
            } else {
                res.send(
                    `<script>alert("Email already in use. Account not created"); window.location.href = "/studentSignUp"; </script>`
                );
            }
        });
    },

    addAffiliation: (req, res) => {
        // used when a student follows an organization
        StudentUser.findById(req.session.userid)
            .then((student) => {
                const org = req.body.org;

                student.affiliations.push(org);
                res.json(student);

                student.save();
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    updateStudentUser: (req, res) => {
        // updates the properties of an organization using its id
        StudentUser.findById(req.session.userid)
            .then((user) => {
                user.email = req.body.email;
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                if (req.body.password) {
                    user.password = req.body.password;
                } else {
                    user.password = req.session.password;
                }

                req.session.email = req.body.email;
                req.session.firstName = req.body.firstName;
                req.session.lastName = req.body.lastName;
                if (req.body.password) {
                    req.session.password = req.body.password;
                }

                // studentUser.email = req.session.email;
                // studentUser.firstName = req.session.firstName;
                // studentUser.lastName = req.session.lastName;
                // studentUser.password = req.session.password;
                req.session.save();
                studentUser = user;

                user.save()
                    .then(() =>
                        res.send(
                            `<script>alert("Account Updated"); window.location.href = "/student-settings"; </script>`
                        )
                    )
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    updateStudentProfile: (req, res) => {
        StudentUser.findById(req.session.userid).then((user) => {
            if (req.body.college == "N/A") {
                user.program = req.body.program;
                user.idNumber = req.body.idNumber;
                user.password = req.session.password;

                studentUser = user;
            } else {
                user.program = req.body.program;
                user.college = req.body.college;
                user.idNumber = req.body.idNumber;
                user.password = req.session.password;

                studentUser = user;
            }
            user.save().then(() => {
                res.send(
                    `<script>alert("Profile Updated"); window.location.href = "/student-edit-profile"; </script>`
                );
            });
        });
    },

    // orgUserModel

    getOrgs: (req, res) => {
        // organization search
        if (req.params.id) {
            // if there is an id in the url, the specific organization will be returned
            OrgUser.findById(req.params.id)
                .then((orgusers) => res.json(orgusers))
                .catch((err) => res.status(400).json("Error: " + err));
        } else {
            // if there is no specific id, all organizations will be returned
            OrgUser.find()
                .then((orgusers) => res.json(orgusers))
                .catch((err) => res.status(400).json("Error: " + err));
        }
    },

    addOrg: (req, res) => {
        // adds a new organization
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const confirm = req.body.confirmPassword;

        OrgUser.findOne({ email: email }).then((orguser) => {
            if (orguser == null) {
                if (password === confirm && password.length >= 8 && email.includes("dlsu.edu.ph")) {
                    const newOrgUser = new OrgUser({ email, password, name });

                    newOrgUser
                        .save()
                        .then(() => {
                            res.send(
                                `<script>alert("Account Created"); window.location.href = "/login"; </script>`
                            );
                        })
                        .catch((err) => res.status(400).json("Error: " + err));
                } else {
                    res.send(
                        `<script>alert("Invalid Credentials. Double check your email and password"); window.location.href = "/orgSignUp"; </script>`
                    );
                }
            } else {
                res.send(
                    `<script>alert("Email already in use. Account not created."); window.location.href = "/orgSignUp"; </script>`
                );
            }
        });
    },

    updateOrgUser: (req, res) => {
        // updates the properties of an organization using its id
        OrgUser.findById(req.session.userid)
            .then((user) => {
                user.email = req.body.email;
                user.password = req.body.password;
                user.name = req.body.name;

                orgUser = req.session;

                user.save()
                    .then(() => res.json("User Updated"))
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    // postModel

    getPosts: (req, res) => {
        // gets all posts from the database
        Posts.find()
            .then((posts) => {
                res.json(posts);
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    getStudentFeedPosts: (req, res) => {
        // gets all posts from the database
        let user = new StudentUser({
            email: req.session.email,
            password: req.session.password,
            firstName: req.session.firstName,
            lastName: req.session.lastName,
            _id: req.session.userid,
        });

        Posts.find()
            .then((posts) => {
                res.render("student_feed", { user: user, post: posts });
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    getOrgFeedPosts: (req, res) => {
        // gets all posts from the database
        Posts.find()
            .then((posts) => {
                res.render("org_feed", { post: posts });
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    getPostsByAffiliations: (req, res) => {
        // returns all posts by the followed organizations of a student through the student's id
        StudentUser.findById(req.session.userid)
            .then((user) => {
                let affiliations = user.affiliations;

                OrgUser.find({ _id: { $in: affiliations } })
                    .then((orguser) => {
                        let orgemails = [];

                        orguser.forEach((element) => {
                            orgemails.push(element.email);
                        });

                        Posts.find({ email: { $in: orgemails } })
                            .sort({ createdAt: -1 })
                            .then((posts) => {
                                res.json(posts);
                            })
                            .catch((err) => res.status(400).json("Error: " + err));
                    })
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    getPostsByUser: (req, res) => {
        // gets the posts of a specific organization using the orgnization id
        OrgUser.findById(req.params.id)
            .then((user) => {
                let userEmail = user.email;
                Posts.find({ email: userEmail })
                    .then((posts) => res.json(posts))
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    addPost: (req, res) => {
        // creates a new post
        const email = req.session.email;
        const content = req.body.content;
        const image = req.body.image;

        OrgUser.findOne({ email: email }).then((user) => {
            const accountName = user.name;

            const newPost = new Posts({ accountName, email, content, image });

            newPost
                .save()
                .then(() => res.json("Post added!"))
                .catch((err) => res.status(400).json("Error: " + err));
        });
    },

    getPostById: (req, res) => {
        // gets a post using its id
        Posts.findById(req.params.id)
            .then((posts) => res.json(posts))
            .catch((err) => res.status(400).json("Error: " + err));
    },

    deletePost: (req, res) => {
        // deletes a post using its id
        Posts.findByIdAndDelete(req.params.id)
            .then(() => res.json("Post Deleted"))
            .catch((err) => res.status(400).json("Error: ") + err);
    },

    updatePost: (req, res) => {
        // updates a post using its id
        Posts.findById(req.params.id)
            .then((post) => {
                post.content = req.body.content;

                post.save()
                    .then(() => res.json("Post Updated"))
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    // eventModel

    getEvents: (req, res) => {
        Event.find()
            .then((events) => {
                res.json(events);
            })
            .catch((err) => res.json(err));
    },

    getStudentFeedEvents: (req, res) => {
        let user = new StudentUser({
            email: req.session.email,
            password: req.session.password,
            firstName: req.session.firstName,
            lastName: req.session.lastName,
            _id: req.session.userid,
        });
        Event.find()
            .then((events) => {
                res.render("student_feed", { user: user, event: events });
            })
            .catch((err) => res.json(err));
    },

    getOrgFeedEvents: (req, res) => {
        Event.find()
            .then((events) => {
                res.render("org_feed", { event: events });
            })
            .catch((err) => res.json(err));
    },

    getEventsByAffiliations: (req, res) => {
        // returns all posts by the followed organizations of a student through the student's id
        StudentUser.findById(req.params.id)
            .then((user) => {
                let affiliations = user.affiliations;

                OrgUser.find({ _id: { $in: affiliations } })
                    .then((orguser) => {
                        let orgemails = [];

                        orguser.forEach((element) => {
                            orgemails.push(element.email);
                        });

                        Event.find({ email: { $in: orgemails } })
                            .sort({ createdAt: -1 })
                            .then((events) => {
                                res.json(events);
                            })
                            .catch((err) => res.status(400).json("Error: " + err));
                    })
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    getEventsByUser: (req, res) => {
        // gets the posts of a specific organization using the orgnization id
        OrgUser.findById(req.params.id)
            .then((user) => {
                let userEmail = user.email;
                Event.find({ email: userEmail })
                    .then((events) => res.json(events))
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    addEvent: (req, res) => {
        // creates a new post
        const email = req.session.email;
        const content = req.body.content;
        const image = req.body.image;
        const eventdate = req.body.date;

        OrgUser.findOne({ email: email }).then((user) => {
            const accountName = user.name;

            const newEvent = new Event({
                accountName,
                email,
                content,
                image,
                eventdate,
            });

            newEvent
                .save()
                .then(() => res.json("Event added!"))
                .catch((err) => res.status(400).json("Error: " + err));
        });
    },

    getEventById: (req, res) => {
        // gets a post using its id
        Event.findById(req.params.id)
            .then((events) => res.json(events))
            .catch((err) => res.status(400).json("Error: " + err));
    },

    deleteEvent: (req, res) => {
        // deletes a post using its id
        Event.findByIdAndDelete(req.params.id)
            .then(() => res.json("Event Deleted"))
            .catch((err) => res.status(400).json("Error: ") + err);
    },

    updateEvent: (req, res) => {
        // updates a post using its id
        Event.findById(req.params.id)
            .then((event) => {
                event.content = req.body.content;

                event
                    .save()
                    .then(() => res.json("Post Updated"))
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },
};

module.exports = controller;
