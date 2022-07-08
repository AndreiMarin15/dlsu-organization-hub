const StudentUser = require("../models/studentUserModel");
const OrgUser = require("../models/orgUserModel");
const Posts = require("../models/postModel");
const Event = require("../models/eventModel");
const Image = require("../models/imageModel");
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

    isLiked: (req, res) => {
        postid = req.query.id;

        Posts.findById(postid).then((post) => {
            index = post.likes.indexOf(req.session.userid);

            if (index != -1) {
                res.send(false);
            } else {
                res.send(true);
            }
        });
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
        res.render("org_create_post", { user: orgUser });
    },

    getEditOrgPost: (req, res) => {
        Posts.findById(req.params.id).then((post) => {
            console.log(post);
            res.render("org_edit_post", { user: orgUser, post: post });
        });
    },

    getEditOrgEvent: (req, res) => {
        Events.findById(req.params.id).then((event) => {
            res.render("org_edit_event", { user: orgUser, event: event });
        });
    },

    getCreateEvent: (req, res) => {
        res.render("org_create_event", { user: orgUser });
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
                        student.password = studentUser.password;

                        student.save();

                        res.redirect("/student-feed/");
                    } else {
                        index = student.saved.indexOf(post._id);

                        student.saved.splice(index, 1);
                        student.password = studentUser.password;

                        student.save();

                        res.redirect("/student-feed/");
                    }
                } else {
                    Events.findById(req.params.id).then((event) => {
                        if (student.saved.indexOf(event._id) == -1 || student.saved == null) {
                            student.saved.push(event._id);
                            student.password = studentUser.password;

                            student.save();

                            res.redirect("/student-feed/events");
                        } else {
                            index = student.saved.indexOf(event._id);

                            student.saved.splice(index, 1);
                            student.password = studentUser.password;

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
                    student.password = studentUser.password;

                    student.save();

                    res.redirect("/student-feed/events");
                } else {
                    index = student.going.indexOf(event._id);
                    student.password = studentUser.password;
                    student.going.splice(index, 1);

                    student.save();

                    res.redirect("/student-feed/events");
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
                            user: studentUser,
                            post: posts,
                            event: events,
                        });
                    })
                    .catch((err) => console.log(err));
            });
    },

    getStudentProfile: (req, res) => {
        res.render("student_profile", { user: studentUser });
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
        res.render("student_settings", { user: studentUser, userid: userid });
    },

    getUpdateProfile: (req, res) => {
        res.render("student_edit_profile", { user: studentUser });
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
                    student.password = studentUser.password;

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
                    student.password = studentUser.password;
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

                student.password = studentUser.password;

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
                        res.render("org_feed", { user: orgUser, post: posts });
                    })
                    .catch((err) => console.log(err));
            });
    },

    getOrgProfile: (req, res) => {
        console.log("Hello " + orgUser);
        res.render("org_profile", { user: orgUser });
    },

    getUpdateOrgProfile: (req, res) => {
        res.render("org_edit_profile", { user: orgUser });
    },

    getOrgSettings: (req, res) => {
        userid = req.session.userid;
        res.render("org_settings", { user: orgUser, userid: userid });
    },

    getStudentSavedPosts: (req, res) => {
        StudentUser.findById(req.session.userid).then((student) => {
            Posts.find({ _id: { $in: student.saved } })
                .sort({ updatedAt: -1 })
                .then((posts) => {
                    res.render("student_saved", { user: studentUser, post: posts });
                });
        });
    },

    getStudentSavedEvents: (req, res) => {
        StudentUser.findById(req.session.userid).then((student) => {
            Events.find({ _id: { $in: student.saved } })
                .sort({ updatedAt: -1 })
                .then((events) => {
                    res.render("student_saved", { user: studentUser, event: events });
                });
        });
    },

    getStudentGoing: (req, res) => {
        StudentUser.findById(req.session.userid).then((student) => {
            Events.find({ _id: { $in: student.going } })
                .sort({ updatedAt: -1 })
                .then((events) => {
                    res.render("student_going", { user: studentUser, event: events });
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
                                    user: studentUser,
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

        Posts.find({ content: { $regex: ".*" + req.body.search + ".*", $options: "i" }, email: req.session.email })
            .sort({ updatedAt: -1 })
            .then((posts) => {
                Event.find({ content: { $regex: ".*" + req.body.search + ".*", $options: "i" }, email: req.session.email })
                    .sort({ updatedAt: -1 })
                    .then((events) => {
                        var searched = req.body.search;

                        res.render("org_search", {
                            user: orgUser,
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
                                `<script>alert("Account Created!"); window.location.href = "/login"; </script>`
                            );
                        })
                        .catch((err) => res.status(400).json("Error: " + err));
                } else if (password != confirm){
                    res.send(
                        `<script>alert("Invalid Credentials. The passwords you entered do not match."); window.location.href = "/orgSignUp"; </script>`
                    );
                }
                else if (password.length < 8){
                    res.send(
                        `<script>alert("Invalid Credentials. Password must have at least 8 characters."); window.location.href = "/orgSignUp"; </script>`
                    );
                }
                else if (!email.includes("dlsu.edu.ph")){
                    res.send(
                        `<script>alert("Invalid Credentials. Email entered is not recognized as a DLSU email."); window.location.href = "/orgSignUp"; </script>`
                    );
                }
            } else {
                res.send(
                    `<script>alert("Email already in use. Failed to create account."); window.location.href = "/studentSignUp"; </script>`
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
                    studentUser = user;
                } else {
                    user.password = studentUser.password;
                    studentUser = user;
                }

                req.session.email = req.body.email;
                req.session.firstName = req.body.firstName;
                req.session.lastName = req.body.lastName;
                if (req.body.password) {
                    studentUser = user;
                    studentUser.password = req.body.password;
                }

                req.session.save();

                user.save()
                    .then(() =>
                        res.send(
                            `<script>alert("Account Updated!"); window.location.href = "/student-settings"; </script>`
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
                user.password = studentUser.password;

                studentUser = user;
            } else {
                user.program = req.body.program;
                user.college = req.body.college;
                user.idNumber = req.body.idNumber;
                user.password = studentUser.password;

                studentUser = user;
            }
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
        OrgUser.findByIdAndDelete(req.session.userid).then(() => {
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
                                `<script>alert("Account Created!"); window.location.href = "/login"; </script>`
                            );
                        })
                        .catch((err) => res.status(400).json("Error: " + err));
                } else if (password != confirm){
                    res.send(
                        `<script>alert("Invalid Credentials. The passwords you entered do not match."); window.location.href = "/orgSignUp"; </script>`
                    );
                }
                else if (password.length < 8){
                    res.send(
                        `<script>alert("Invalid Credentials. Password must have at least 8 characters."); window.location.href = "/orgSignUp"; </script>`
                    );
                }
                else if (!email.includes("dlsu.edu.ph")){
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
    },

    updateOrgUser: (req, res) => {
        // updates the properties of an organization using its id
        OrgUser.findById(req.session.userid)
            .then((user) => {
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.body.password) {
                    user.password = req.body.password;
                    orgUser = user;
                } else {
                    user.password = orgUser.password;
                    orgUser = user;
                }

                req.session.name = req.body.name;
                req.session.email = req.body.email;
                if (req.body.password) {
                    orgUser = user;
                    orgUser.password = req.body.password;
                }

                req.session.save();

                user.save()
                    .then(() =>
                        res.send(
                            `<script>alert("Account Updated!"); window.location.href = "/org-settings"; </script>`
                        )
                    )
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },

    updateOrgProfile: (req, res) => {
        OrgUser.findById(req.session.userid).then((user) => {
            if (req.body.affiliation == "N/A") {
                user.type = req.body.type;
                user.facebook = req.body.facebook;
                user.instagram = req.body.instagram;
                user.twitter = req.body.twitter;
                user.linkedin = req.body.linkedin;

                user.password = orgUser.password;

                orgUser = user;
            } else {
                user.type = req.body.type;
                user.affiliation = req.body.affiliation;
                user.facebook = req.body.facebook;
                user.instagram = req.body.instagram;
                user.twitter = req.body.twitter;
                user.linkedin = req.body.linkedin;

                user.password = orgUser.password;

                orgUser = user;
            }

            user.save().then(() => {
                res.send(
                    `<script>alert("Account Updated!"); window.location.href = "/org-edit-profile"; </script>`
                );
            });
        });
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

        Posts.find()
            .sort({ updatedAt: -1 })
            .then((posts) => {
                res.render("student_feed", { user: studentUser, post: posts });
            })
            .catch((err) => res.status(400).json("Error: " + err));
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
                            .sort({ updatedAt: -1 })
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
                    .sort({ updatedAt: -1 })
                    .then((posts) => res.json(posts))
                    .catch((err) => res.status(400).json("Error: " + err));
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

            if (req.body.image) {
                const image = req.body.image;
                const newPost = new Posts({ accountName, email, content, image, date });

                newPost
                    .save()
                    .then(() => {
                        res.redirect("/org-feed");
                    })
                    .catch((err) => res.status(400).json("Error: " + err));
            } else {
                const newPost = new Posts({ accountName, email, content, date });

                newPost
                    .save()
                    .then(() => {
                        res.redirect("/org-feed");
                    })
                    .catch((err) => res.status(400).json("Error: " + err));
            }
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
                post.content = req.body.content;

                post.save()
                    .then(() =>
                        res.send(
                            `<script>alert("Post Updated!"); window.location.href = "/org-feed"; </script>`
                        )
                    )
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
        Event.find()
            .sort({ updatedAt: -1 })
            .then((events) => {
                res.render("student_feed", { user: studentUser, event: events });
            })
            .catch((err) => res.json(err));
    },

    getOrgFeedEvents: (req, res) => {
        Event.find({ email: req.session.email })
            .sort({ updatedAt: -1 })
            .then((events) => {
                res.render("org_feed", { user: orgUser, event: events });
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
                            .sort({ updatedAt: -1 })
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
        var date = new Date(Date.now());

        date = moment(date).format("MMMM DD, YYYY h:mm A");

        OrgUser.findOne({ email: email }).then((user) => {
            const accountName = user.name;

            if (req.body.image) {
                const image = req.body.image;
                const newEvent = new Event({
                    accountName,
                    email,
                    content,
                    image,
                    date,
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

    getEventById: (req, res) => {
        // gets a post using its id
        Event.findById(req.params.id)
            .then((events) => res.json(events))
            .catch((err) => res.status(400).json("Error: " + err));
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
                event.content = req.body.content;

                event
                    .save()
                    .then(() =>
                        res.send(
                            `<script>alert("Event Updated!"); window.location.href = "/org-feed/events"; </script>`
                        )
                    )
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    },
};

module.exports = controller;
