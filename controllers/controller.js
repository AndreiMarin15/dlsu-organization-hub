const StudentUser = require("../models/studentUserModel");
const OrgUser = require("../models/orgUserModel");
const Posts = require("../models/postModel");
const bcrypt = require("bcrypt");

/* POSSIBLE CHANGES (once frontend is implemented):
    - Some req.___ might need to be changed depending on front end
    - Getting parameteres such as userid may be changed to username if needed
    - responses(res.jsons) -> res.send or res.render
    - optimize for using handlebars
*/

const controller = {
    // test functions - to be deleted, DO NOT USE IN FRONTEND
    bcryptTest: (req, res) => {
        OrgUser.findById(req.params.id)
            .then((orguser) => {
                let password = req.body.password;

                if (bcrypt.compare(orguser.password, password)) {
                    res.json(orguser);
                } else {
                    res.json("error in bcrypt");
                }
            })
            .catch((err) => res.status(400).json(err));
    },

    // general
    validateLogIn: function (req, res) {
        StudentUser.findOne({ email: req.query.email })
        .then((studentuser) => {
           
            if (studentuser) {
                bcrypt.compare(req.query.password, studentuser.password, function (error, isVerify) {
                    res.send(isVerify);
                });
            } else {
                OrgUser.findOne({email: req.query.email})
                    .then(orguser => {
                        if(orguser){
                            bcrypt.compare(req.query.password, orguser.password, function (error, isVerify) {
                                res.send(isVerify);
                            });
                        }

                        else{
                            res.send(false);
                        }
                    })

            }
        })
        .catch(err => res.json(err));
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
         res.render("student_feed");
         
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
                Posts.find({ content: { $regex: ".*" + req.body.search + ".*" } })
                    .then((post) => {
                        res.json(post);
                    })
                    .catch((err) => res.status(400).json("Error: " + err));
            } else {
                res.json(user);
            }
        });
    },

    logIn: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;

        OrgUser.findOne({email: email})
            .then(orguser => {
                if(orguser != null){
                    bcrypt.compare(password, orguser.password)
                        .then(isVerify => {
                            if(isVerify){
                                req.session.id = orguser._id;
                                res.redirect("/org-feed");
                            }
                        })
                }
                else {
                    StudentUser.findOne({email: email})
                        .then(studentuser => {
                            if(studentuser != null){
                                bcrypt.compare(password, studentuser.password)
                        .then(isVerify => {
                            if(isVerify){
                                req.session.userid = studentuser._id;
                                console.log("id: "+ req.session.userid);
                                res.redirect("/student-feed");
                                
                            } else {

                                res.redirect("/logIn");
                            }
                        })
                            }
                            else{
                                console.log("Not found");
                                res.redirect("/logIn")
                            }
                        })
                }
            })
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

        if (bcrypt.compare(password, confirm)) {
            const newStudentUser = new StudentUser({ firstName, lastName, email, password });

            newStudentUser
                .save()
                .then(() => res.json("User added!"))
                .catch((err) => res.status(400).json("Error: " + err));
        } else {
            //codes for password do not match
        }
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

        if (bcrypt.compare(password, confirm)) {
            const newOrgUser = new OrgUser({ email, password, name });

            newOrgUser
                .save()
                .then(() => res.json("User added!"))
                .catch((err) => res.status(400).json("Error: " + err));
        } else {
            //codes for password do not match
        }
    },

    updateOrgUser: (req, res) => {
        // updates the properties of an organization using its id
        OrgUser.findById(req.params.id)
            .then((user) => {
                user.email = req.body.email;
                user.password = req.body.password;
                user.name = req.body.name;

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
        const email = req.body.email;
        const content = req.body.content;
        const image = req.body.image;
        let numberlikes = 0;

        const newPost = new Posts({ email, content, image, numberlikes });

        newPost
            .save()
            .then(() => res.json("Post added!"))
            .catch((err) => res.status(400).json("Error: " + err));
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
};

module.exports = controller;
