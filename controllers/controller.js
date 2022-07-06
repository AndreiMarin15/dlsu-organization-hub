const StudentUser = require("../models/studentUserModel");
const OrgUser = require("../models/orgUserModel");
const Posts = require("../models/postModel");
const Event = require("../models/eventModel");
const Image = require("../models/imageModel");
const bcrypt = require("bcrypt");

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
    age: "",
    sex: "",
    birthday: "",
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
        res.render("log_in");
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

    getOrgFeed: (req, res) => {
        res.render("org_feed");
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

        OrgUser.findOne({ email: email }).then((orguser) => {
            if (orguser != null) {
                bcrypt.compare(password, orguser.password).then((isVerify) => {
                    if (isVerify) {
                        req.session.email = orguser.email;
                        req.session.userid = orguser._id;
                        req.session.name = orguser.name;

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

                                var login = {
                                    email: studentuser.email,
                                    password: studentuser.password,
                                    firstName: studentuser.firstName,
                                    lastName: studentuser.lastName,
                                    program: studentuser.program,
                                    college: studentuser.college,
                                    age: studentuser.age,
                                    sex: studentuser.sex,
                                    birthday: studentuser.birthday,
                                    
                                
                                }

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

        console.log(password + " hello " + confirm);

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
        StudentUser.findById(req.params.id)
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
                user.password = req.body.password;

                req.session.email = req.body.email;
                req.session.firstName = req.body.firstName;
                req.session.lastName = req.body.lastName;
                req.session.password = req.body.password;

                studentUser = req.session;

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
        OrgUser.findById(req.params.id)
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
        StudentUser.findById(req.params.id)
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
        let numberlikes = 0;

        OrgUser.findOne({ email: email }).then((user) => {
            const accountName = user.name;

            const newPost = new Posts({ accountName, email, content, image, numberlikes });

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
        let numberlikes = 0;
        let numbergoing = 0;

        OrgUser.findOne({ email: email }).then((user) => {
            const accountName = user.name;

            const newEvent = new Event({
                accountName,
                email,
                content,
                image,
                eventdate,
                numberlikes,
                numbergoing,
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
