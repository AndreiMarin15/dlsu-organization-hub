const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const orgUserSchema = new Schema(
    {
        //remove personal details (first name, last name, personal email) from index.html
        email: {
            type: String,
            required: false,
            unique: true,
            trim: true,
            minlength: 5,
        },
        password: {
            type: String,
            required: false,
            minlength: 8,
        },
        name: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            required: false,
        },
        affiliation: {
            type: String,
            required: false,
        },
        facebook: {
            type: String,
            required: false,
        },
        instagram: {
            type: String,
            required: false,
        },
        twitter: {
            type: String,
            required: false,
        },
        linkedin: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

orgUserSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(this.password, salt);

        this.password = hashed;

        next();
    } catch (err) {
        next(err);
    }
});

const OrgUser = mongoose.model("OrgUser", orgUserSchema);

module.exports = OrgUser;
