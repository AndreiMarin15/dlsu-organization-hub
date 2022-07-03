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

    getIndex: (req, res) => {
        res.render("index");
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

    orgLogIn: (req, res) => {
        if (req.body.email) {
            OrgUser.findOne({ email: req.body.email })
                .then((orguser) => {
                    if (orguser) {
                        if (req.body.password) {
                            if (bcrypt.compare(orguser.password, req.body.password)) {
                                res.json(`Login successful. Welcome, ${orguser.name}`);
                                // assign to session database yung password, email, and id ni org user
                            } else {
                                res.json("Password Incorrect");
                            }
                        } else {
                            res.json("Please input your password.");
                        }
                    } else {
                        res.json("No Organization email found.");
                    }
                })
                .catch((err) => res.status(400).json("Error " + err));
        }
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

        const newStudentUser = new StudentUser({ email, password });

        newStudentUser
            .save()
            .then(() => res.json("User added!"))
            .catch((err) => res.status(400).json("Error: " + err));
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

        const newOrgUser = new OrgUser({ email, password });

        newOrgUser
            .save()
            .then(() => res.json("User added!"))
            .catch((err) => res.status(400).json("Error: " + err));
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
            .then((posts) => res.json(posts))
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
