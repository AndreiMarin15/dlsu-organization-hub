const StudentUser = require("../models/studentUserModel");
const OrgUser = require("../models/orgUserModel");
const Posts = require("../models/postModel");
const Event = require("../models/eventModel");
const bcrypt = require("bcrypt");
const Events = require("../models/eventModel");
const moment = require("moment");

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
    type: "",
    affiliation: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    image: "",
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
        res.render("org_create_post", { user: req.session });
    },

    getEditOrgPost: (req, res) => {
        Posts.findById(req.params.id).then((post) => {
            console.log(post);
            res.render("org_edit_post", { user: req.session, post: post });
        });
    },

    getEditOrgEvent: (req, res) => {
        Events.findById(req.params.id).then((event) => {
            res.render("org_edit_event", { user: req.session, event: event });
        });
    },

    getCreateEvent: (req, res) => {
        res.render("org_create_event", { user: req.session });
    },

    likePost: (req, res) => {
        Posts.findById(req.params.id).then((post) => {
            if (post != null) {
                if (post.likes.indexOf(req.session.userid) == -1 || post.likes == null) {
                    post.likes.push(req.session.userid);

                    post.save();

                    res.redirect("back");
                } else {
                    index = post.likes.indexOf(req.session.userid);

                    post.likes.splice(index, 1);

                    post.save();
                    res.redirect("back");
                }
            } else {
                Events.findById(req.params.id).then((event) => {
                    if (event.likes.indexOf(req.session.userid) == -1 || event.likes == null) {
                        event.likes.push(req.session.userid);

                        event.save();

                        res.redirect("back");
                    } else {
                        index = event.likes.indexOf(req.session.userid);

                        event.likes.splice(index, 1);

                        event.save();
                        res.redirect("back");
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
                        console.log(student);
                        res.redirect("back");
                    } else {
                        index = student.saved.indexOf(post._id);

                        student.saved.splice(index, 1);

                        student.save();

                        res.redirect("back");
                    }
                } else {
                    Events.findById(req.params.id).then((event) => {
                        if (student.saved.indexOf(event._id) == -1 || student.saved == null) {
                            student.saved.push(event._id);

                            student.save();

                            res.redirect("back");
                        } else {
                            index = student.saved.indexOf(event._id);

                            student.saved.splice(index, 1);

                            student.save();

                            res.redirect("back");
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

                    res.redirect("back");
                } else {
                    index = student.going.indexOf(event._id);

                    student.going.splice(index, 1);

                    student.save();

                    res.redirect("back");
                }
            });
        });
    },

    getStudentFeed: (req, res) => {
        Posts.find()
            .sort({ updatedAt: -1 })
            .then((posts) => {
                Event.find()
                    .then((events) => {
                        res.render("student_feed", {
                            user: req.session,
                            post: posts,
                            event: events,
                        });
                    })
                    .catch((err) => console.log(err));
            });
    },

    getStudentProfile: (req, res) => {
        res.render("student_profile", { user: req.session });
    },

    getStudentFollowing: (req, res) => {
        StudentUser.findById(req.session.userid).then((studentuser) => {
            OrgUser.find({ _id: { $in: studentuser.following } }).then((org) => {
                res.render("student_following", { user: studentuser, org: org });
            });
        });
    },

    getStudentSettings: (req, res) => {
        userid = req.session.id;
        res.render("student_settings", { user: req.session, userid: userid });
    },

    getUpdateProfile: (req, res) => {
        res.render("student_edit_profile", { user: req.session });
    },

    getOrgFeedStudentView: (req, res) => {
        Posts.findById(req.params.id).then((result) => {
            if (result) {
                email = result.email;

                OrgUser.findOne({ email: email }).then((orguser) => {
                    Posts.find({ email: orguser.email })
                        .sort({ updatedAt: -1 })
                        .then((posts) => {
                            Events.find({ email: orguser.email })
                                .sort({ updatedAt: -1 })
                                .then((events) => {
                                    res.render("student_org_feed", {
                                        user: orguser,
                                        post: posts,
                                        event: events,
                                    });
                                });
                        });
                });
            } else {
                Events.findById(req.params.id).then((result2) => {
                    if (result2) {
                        email = result2.email;

                        OrgUser.findOne({ email: email }).then((orguser) => {
                            Events.find({ email: orguser.email })
                                .sort({ updatedAt: -1 })
                                .then((events) => {
                                    Posts.find({ email: orguser.email })
                                        .sort({ updatedAt: -1 })
                                        .then((posts) => {
                                            res.render("student_org_feed", {
                                                user: orguser,
                                                post: posts,
                                                event: events,
                                            });
                                        });
                                });
                        });
                    } else {
                        OrgUser.findById(req.params.id).then((orguser) => {
                            Posts.find({ email: orguser.email })
                                .sort({ updatedAt: -1 })
                                .then((posts) => {
                                    Events.find({ email: orguser.email })
                                        .sort({ updatedAt: -1 })
                                        .then((events) => {
                                            res.render("student_org_feed", {
                                                user: orguser,
                                                post: posts,
                                                event: events,
                                            });
                                        });
                                });
                        });
                    }
                });
            }
        });
    },

    getOrgProfileStudentView: (req, res) => {
        OrgUser.findById(req.params.id).then((orguser) => {
            res.render("student_org_profile", { user: orguser });
        });
    },

    followOrg: (req, res) => {
        OrgUser.findById(req.params.id).then((orguser) => {
            StudentUser.findById(req.session.userid).then((student) => {
                if (student.following.indexOf(orguser._id) == -1 || student.following == null) {
                    student.following.push(orguser._id);

                    student.save();

                    let alert = "Org Unfollowed!";
                    let window = `/student-view-org/${orguser._id}`;

                    // res.send(
                    //     `<script>alert(${alert}); window.location.href = ${window}; </script>`
                    // );
                    res.redirect(window);
                } else {
                    index = student.following.indexOf(orguser._id);

                    student.following.splice(index, 1);

                    student.save();

                    let alert = "Org Unfollowed!";
                    let window = `/student-view-org/${orguser._id}`;

                    res.redirect(window);

                    // res.send(
                    //     `<script>alert(${alert}); window.location.href = ${window}; </script>`
                    // );
                }
            });
        });
    },

    unfollow: (req, res) => {
        StudentUser.findById(req.session.userid).then((student) => {
            index = student.following.indexOf(req.params.id);

            if (index != -1) {
                student.following.splice(index, 1);

                student.save();

                res.send(
                    `<script>alert("Org Unfollowed!"); window.location.href = "/student-profile/following"; </script>`
                );
            }
        });
    },

    getOrgFeed: (req, res) => {
        Posts.find({ email: req.session.email })
            .sort({ updatedAt: -1 })
            .then((posts) => {
                Event.find({ email: req.session.email })
                    .then((events) => {
                        res.render("org_feed", { user: req.session, post: posts });
                    })
                    .catch((err) => console.log(err));
            });
    },

    getOrgProfile: (req, res) => {
        console.log("Hello " + orgUser);
        res.render("org_profile", { user: req.session });
    },

    getUpdateOrgProfile: (req, res) => {
        res.render("org_edit_profile", { user: req.session });
    },

    getOrgSettings: (req, res) => {
        userid = req.session.userid;
        res.render("org_settings", { user: req.session, userid: userid });
    },

    getStudentSavedPosts: (req, res) => {
        StudentUser.findById(req.session.userid).then((student) => {
            Posts.find({ _id: { $in: student.saved } })
                .sort({ updatedAt: -1 })
                .then((posts) => {
                    res.render("student_saved", { user: req.session, post: posts });
                });
        });
    },

    getStudentSavedEvents: (req, res) => {
        StudentUser.findById(req.session.userid).then((student) => {
            Events.find({ _id: { $in: student.saved } })
                .sort({ updatedAt: -1 })
                .then((events) => {
                    res.render("student_saved", { user: req.session, event: events });
                });
        });
    },

    getStudentGoing: (req, res) => {
        StudentUser.findById(req.session.userid).then((student) => {
            Events.find({ _id: { $in: student.going } })
                .sort({ updatedAt: -1 })
                .then((events) => {
                    res.render("student_going", { user: req.session, event: events });
                });
        });
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) throw err;
            res.redirect("/");
        });
    },

    search: (req, res) => {
        // searches for an org user through the org name, if the inital find method returns a blank array, it searches for posts matching its content

        OrgUser.find({ name: { $regex: ".*" + req.body.search + ".*", $options: "i" } }).then(
            (orguser) => {
                Posts.find({ content: { $regex: ".*" + req.body.search + ".*", $options: "i" } })
                    .sort({ updatedAt: -1 })
                    .then((posts) => {
                        Event.find({
                            content: { $regex: ".*" + req.body.search + ".*", $options: "i" },
                        })
                            .sort({ updatedAt: -1 })
                            .then((events) => {
                                var searched = req.body.search;

                                res.render("student_search", {
                                    user: req.session,
                                    orguser: orguser,
                                    post: posts,
                                    event: events,
                                    searched: searched,
                                });
                            });
                    });
            }
        );
    },

    searchOrg: (req, res) => {
        // searches for an org user through the org name, if the inital find method returns a blank array, it searches for posts matching its content

        Posts.find({
            content: { $regex: ".*" + req.body.search + ".*", $options: "i" },
            email: req.session.email,
        })
            .sort({ updatedAt: -1 })
            .then((posts) => {
                Event.find({
                    content: { $regex: ".*" + req.body.search + ".*", $options: "i" },
                    email: req.session.email,
                })
                    .sort({ updatedAt: -1 })
                    .then((events) => {
                        var searched = req.body.search;

                        res.render("org_search", {
                            user: req.session,
                            post: posts,
                            event: events,
                            searched: searched,
                        });
                    });
            });
    },

    logIn: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        req.session.email = email;

        OrgUser.findOne({ email: email }).then((orguser) => {
            if (orguser != null) {
                orgUser.password = password;

                bcrypt.compare(password, orguser.password).then((isVerify) => {
                    if (isVerify) {
                        req.session.email = orguser.email;
                        req.session.userid = orguser._id;
                        req.session.name = orguser.name;
                        req.session.type = orguser.type;
                        req.session.affiliation = orguser.affiliation;
                        req.session.facebook = orguser.facebook;
                        req.session.twitter = orguser.twitter;
                        req.session.instagram = orguser.instagram;
                        req.session.linkedin = orguser.linkedin;
                        req.session.image = orguser.image;

                        req.session.usertype = "org";

                        req.session.save();

                        var login = {
                            email: orguser.email,
                            password: orgUser.password,
                            name: orguser.name,
                            type: orguser.type,
                            affiliation: orguser.affiliation,
                            facebook: orguser.facebook,
                            twitter: orguser.twitter,
                            instagram: orguser.instagram,
                            linkedin: orguser.linkedin,
                            image: orguser.image,
                        };

                        orgUser = login;

                        res.redirect("/org-feed");
                    }
                });
            } else {
                StudentUser.findOne({ email: email }).then((studentuser) => {
                    if (studentuser != null) {
                        studentUser.password = password;
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
                                    password: studentUser.password,
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

    addStudent: (req, res) => {
        // adds a new student to the database
        const email = req.body.email;
        const password = req.body.password;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const confirm = req.body.confirmPassword;

        bcrypt.hash(password, 10, function (err, hash) {
            StudentUser.findOne({ email: email }).then((studentuser) => {
                if (studentuser == null) {
                    if (
                        password === confirm &&
                        password.length >= 8 &&
                        email.includes("dlsu.edu.ph")
                    ) {
                        const newStudentUser = new StudentUser({
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            password: hash,
                        });

                        newStudentUser
                            .save()
                            .then(() => {
                                res.send(
                                    `<script>alert("Account Created!"); window.location.href = "/login"; </script>`
                                );
                            })
                            .catch((err) => res.status(400).json("Error: " + err));
                    } else if (password != confirm) {
                        res.send(
                            `<script>alert("Invalid Credentials. The passwords you entered do not match."); window.location.href = "/studentSignUp"; </script>`
                        );
                    } else if (password.length < 8) {
                        res.send(
                            `<script>alert("Invalid Credentials. Password must have at least 8 characters."); window.location.href = "/studentSignUp"; </script>`
                        );
                    } else if (!email.includes("dlsu.edu.ph")) {
                        res.send(
                            `<script>alert("Invalid Credentials. Email entered is not recognized as a DLSU email."); window.location.href = "/studentSignUp"; </script>`
                        );
                    }
                } else {
                    res.send(
                        `<script>alert("Email already in use. Failed to create account."); window.location.href = "/studentSignUp"; </script>`
                    );
                }
            });
        });
    },

    updateStudentUser: (req, res) => {
        // updates the properties of an organization using its id
        StudentUser.findById(req.session.userid).then((user) => {
            if (req.body.email) {
                user.email = req.body.email;
                req.session.email = req.body.email;
            }

            if (req.body.firstName) {
                user.firstName = req.body.firstName;
                req.session.firstName = req.body.firstName;
            }

            if (req.body.lastName) {
                user.lastName = req.body.lastName;
                req.session.lastName = req.body.lastName;
            }

            if (req.body.password) {
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    user.password = hash;

                    studentUser = user;

                    user.save()
                        .then(() =>
                            res.send(
                                `<script>alert("Account Updated!"); window.location.href = "/student-settings"; </script>`
                            )
                        )
                        .catch((err) => res.status(400).json("Error: " + err));
                });
            } else {
                studentUser = user;

                user.save()
                    .then(() =>
                        res.send(
                            `<script>alert("Account Updated!"); window.location.href = "/student-settings"; </script>`
                        )
                    )
                    .catch((err) => res.status(400).json("Error: " + err));
            }
        });
    },

    updateStudentProfile: (req, res) => {
        StudentUser.findById(req.session.userid).then((user) => {
            if (req.body.program != "/" && req.body.program) {
                user.program = req.body.program;
                req.session.program = user.program;
            }

            if (req.body.college != "N/A") {
                user.college = req.body.college;
                req.session.college = req.body.college;
            }

            if (req.body.idNumber != "/" && req.body.idNumber) {
                user.idNumber = req.body.idNumber;
                req.session.idNumber = user.idNumber;
            }

            studentUser = user;

            user.save().then(() => {
                res.send(
                    `<script>alert("Profile Updated!"); window.location.href = "/student-edit-profile"; </script>`
                );
            });
        });
    },

    deleteStudent: (req, res) => {
        StudentUser.findByIdAndDelete(req.session.userid).then(() => {
            res.send(`
            <script> window.location.href = "/logout"; </script>
            `);
        });
    },

    deleteStudentAccount: (req, res) => {
        // deletes a student acct using its id
        StudentUser.findById(req.session.userid)
            .then(() => {
                res.send(
                    `<script>
                        let isExecuted = confirm("Are you sure you want to delete your account?"); 
                        if (isExecuted)
                            window.location.href = "/deleteStudent"; 
                        else 
                        window.location.href = "/student-settings";
                    </script>`
                );
            })
            .catch((err) => res.status(400).json("Error: ") + err);
    },

    deleteOrg: (req, res) => {
        Posts.deleteMany({ email: req.session.email }).then((deleted) => {
            console.log(deleted);
        });
        Events.deleteMany({ email: req.session.email }).then((deleted) => {
            console.log(deleted);
        });

        OrgUser.findByIdAndDelete(req.session.userid).then((orguser) => {
            res.send(`
            <script> window.location.href = "/logout"; </script>
            `);
        });
    },

    deleteOrgAccount: (req, res) => {
        // deletes a org acct using its id
        OrgUser.findById(req.session.userid)
            .then(() => {
                res.send(
                    `<script>
                        let isExecuted = confirm("Are you sure you want to delete your account?"); 
                        if (isExecuted)
                            window.location.href = "/deleteOrg"; 
                            else 
                            window.location.href = "/org-settings";
                    </script>`
                );
            })
            .catch((err) => res.status(400).json("Error: ") + err);
    },

    // orgUserModel

    addOrg: (req, res) => {
        // adds a new organization
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const confirm = req.body.confirmPassword;

        bcrypt.hash(password, 10, function (err, hash) {
            OrgUser.findOne({ email: email }).then((orguser) => {
                if (orguser == null) {
                    if (
                        password === confirm &&
                        password.length >= 8 &&
                        email.includes("dlsu.edu.ph")
                    ) {
                        const newOrgUser = new OrgUser({
                            email: email,
                            password: hash,
                            name: name,
                        });

                        newOrgUser
                            .save()
                            .then(() => {
                                res.send(
                                    `<script>alert("Account Created!"); window.location.href = "/login"; </script>`
                                );
                            })
                            .catch((err) => res.status(400).json("Error: " + err));
                    } else if (password != confirm) {
                        res.send(
                            `<script>alert("Invalid Credentials. The passwords you entered do not match."); window.location.href = "/orgSignUp"; </script>`
                        );
                    } else if (password.length < 8) {
                        res.send(
                            `<script>alert("Invalid Credentials. Password must have at least 8 characters."); window.location.href = "/orgSignUp"; </script>`
                        );
                    } else if (!email.includes("dlsu.edu.ph")) {
                        res.send(
                            `<script>alert("Invalid Credentials. Email entered is not recognized as a DLSU email."); window.location.href = "/orgSignUp"; </script>`
                        );
                    }
                } else {
                    res.send(
                        `<script>alert("Email already in use. Account not created."); window.location.href = "/orgSignUp"; </script>`
                    );
                }
            });
        });
    },

    updateOrgUser: (req, res) => {
        // updates the properties of an organization using its id
        OrgUser.findById(req.session.userid).then((user) => {
            if (req.body.email) {
                user.email = req.body.email;
                req.session.email = req.body.email;
            }

            if (req.body.name) {
                user.name = req.body.name;
                req.session.name = req.body.name;
            }

            if (req.body.password) {
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    user.password = hash;

                    orgUser = user;

                    user.save()
                        .then(() =>
                            res.send(
                                `<script>alert("Account Updated!"); window.location.href = "/org-settings"; </script>`
                            )
                        )
                        .catch((err) => res.status(400).json("Error: " + err));
                });
            } else {
                orgUser = user;

                user.save()
                    .then(() =>
                        res.send(
                            `<script>alert("Account Updated!"); window.location.href = "/org-settings"; </script>`
                        )
                    )
                    .catch((err) => res.status(400).json("Error: " + err));
            }
        });
    },

    updateOrgProfile: (req, res) => {
        OrgUser.findById(req.session.userid).then((user) => {
            if (req.body.type != "/" && req.body.type) {
                user.type = req.body.type;
                req.session.type = user.type;
            }

            if (req.body.affiliation != "N/A" && req.body.affiliation) {
                user.affiliation = req.body.affiliation;
                req.session.affiliation = user.affiliation;
            }

            if (req.body.facebook != "/" && req.body.facebook) {
                user.facebook = req.body.facebook;
                req.session.facebook = req.body.facebook;
            }

            if (req.body.instagram != "/" && req.body.instagram) {
                user.instagram = req.body.instagram;
                req.session.instagram = user.instagram;
            }

            if (req.body.twitter != "/" && req.body.twitter) {
                user.twitter = req.body.twitter;
                req.session.twitter = user.twitter;
            }

            if (req.body.linkedin != "/" && req.body.linkedin) {
                user.linkedin = req.body.linkedin;
                req.session.linkedin = user.linkedin;
            }

            if (req.file) {
                user.image = req.file.originalname;
                req.session.image = req.file.originalname;
            }

            orgUser = user;

            user.save().then(() => {
                res.send(
                    `<script>alert("Profile Updated!"); window.location.href = "/org-edit-profile"; </script>`
                );
            });
        });
    },

    // postModel

    getStudentFeedPosts: (req, res) => {
        // gets all posts from the database

        StudentUser.findById(req.session.userid).then((student) => {
            if (student.following != null) {
                OrgUser.find({ _id: { $in: student.following } }).then((orgs) => {
                    let emails = [];
                    orgs.forEach((org) => {
                        emails.push(org.email);
                    });

                    Posts.find({ email: { $in: emails } })
                        .sort({ updatedAt: -1 })
                        .then((posts) => {
                            res.render("student_feed", { user: req.session, post: posts });
                        });
                });
            } else {
                res.render("student_feed", { user: req.session });
            }
        });
    },

    getOrgFeedPosts: (req, res) => {
        // gets all posts from the database
        Posts.find()
            .sort({ updatedAt: -1 })
            .then((posts) => {
                res.render("org_feed", { post: posts });
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    addPost: (req, res) => {
        // creates a new post
        const email = req.session.email;
        const content = req.body.content;
        var date = new Date(Date.now());

        date = moment(date).format("MMMM DD, YYYY h:mm A");

        OrgUser.findOne({ email: email }).then((user) => {
            const accountName = user.name;
            const profile = user.image;

            if (req.file) {
                const image = req.file.originalname;
                const newPost = new Posts({ accountName, email, content, image, date, profile });

                newPost
                    .save()
                    .then(() => {
                        res.redirect("/org-feed");
                    })
                    .catch((err) => res.status(400).json("Error: " + err));
            } else {
                const newPost = new Posts({ accountName, email, content, date, profile });

                newPost
                    .save()
                    .then(() => {
                        res.redirect("/org-feed");
                    })
                    .catch((err) => res.status(400).json("Error: " + err));
            }
        });
    },

    deletePost: (req, res) => {
        // deletes a post using its id
        Posts.findByIdAndDelete(req.params.id)
            .then(() =>
                res.send(
                    `<script>alert("Post Deleted!"); window.location.href = "/org-feed"; </script>`
                )
            )
            .catch((err) => res.status(400).json("Error: ") + err);
    },

    updatePost: (req, res) => {
        // updates a post using its id
        Posts.findById(req.params.id)
            .then((post) => {
                if (req.file) {
                    post.image = req.file.originalname;

                    post.content = req.body.content;

                    post.save()
                        .then(() =>
                            res.send(
                                `<script>alert("Post Updated!"); window.location.href = "/org-feed"; </script>`
                            )
                        )
                        .catch((err) => res.status(400).json("Error: " + err));
                } else {
                    post.content = req.body.content;

                    post.save()
                        .then(() =>
                            res.send(
                                `<script>alert("Post Updated!"); window.location.href = "/org-feed"; </script>`
                            )
                        )
                        .catch((err) => res.status(400).json("Error: " + err));
                }
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    // eventModel

    getStudentFeedEvents: (req, res) => {
        StudentUser.findById(req.session.userid).then((student) => {
            OrgUser.find({ _id: { $in: student.following } }).then((orgs) => {
                let emails = [];
                orgs.forEach((org) => {
                    emails.push(org.email);
                });

                Events.find({ email: { $in: emails } })
                    .sort({ updatedAt: -1 })
                    .then((events) => {
                        res.render("student_feed", { user: req.session, event: events });
                    });
            });
        });
    },

    getOrgFeedEvents: (req, res) => {
        Event.find({ email: req.session.email })
            .sort({ updatedAt: -1 })
            .then((events) => {
                res.render("org_feed", { user: req.session, event: events });
            })
            .catch((err) => res.json(err));
    },

    addEvent: (req, res) => {
        // creates a new post
        const email = req.session.email;
        const content = req.body.content;
        var date = new Date(Date.now());

        date = moment(date).format("MMMM DD, YYYY h:mm A");

        OrgUser.findOne({ email: email }).then((user) => {
            const accountName = user.name;
            const profile = user.image;

            if (req.file) {
                const image = req.file.originalname;
                const newEvent = new Event({
                    accountName,
                    email,
                    content,
                    image,
                    date,
                    profile,
                });

                newEvent
                    .save()
                    .then(() => {
                        res.redirect("/org-feed/events");
                    })
                    .catch((err) => res.status(400).json("Error: " + err));
            } else {
                const newEvent = new Event({
                    accountName,
                    email,
                    content,
                    date,
                    profile,
                });

                newEvent
                    .save()
                    .then(() => {
                        res.redirect("/org-feed/events");
                    })
                    .catch((err) => res.status(400).json("Error: " + err));
            }
        });
    },

    deleteEvent: (req, res) => {
        // deletes a post using its id
        Event.findByIdAndDelete(req.params.id)
            .then(() =>
                res.send(
                    `<script>alert("Event Deleted!"); window.location.href = "/org-feed/events"; </script>`
                )
            )
            .catch((err) => res.status(400).json("Error: ") + err);
    },

    updateEvent: (req, res) => {
        // updates a post using its id
        Event.findById(req.params.id)
            .then((event) => {
                if (req.file) {
                    event.image = req.file.originalname;
                    event.content = req.body.content;

                    event
                        .save()
                        .then(() =>
                            res.send(
                                `<script>alert("Event Updated!"); window.location.href = "/org-feed/events"; </script>`
                            )
                        );
                } else {
                    event.content = req.body.content;

                    event
                        .save()
                        .then(() =>
                            res.send(
                                `<script>alert("Event Updated!"); window.location.href = "/org-feed/events"; </script>`
                            )
                        )
                        .catch((err) => res.status(400).json("Error: " + err));
                }
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },
};

module.exports = controller;
