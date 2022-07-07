const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const studentUserSchema = new Schema(
    {

        //make first name and last name required
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
        firstName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: false,
        },
        program: {
            type: String,
            required: false,
        },
        college: {
            type: String,
            required: false,
        },
        idNumber: {
            type: Number,
            required: false,
        },
        
        following: [],
        saved: [],
    },
    {
        timestamps: true,
    }
);

studentUserSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(this.password, salt);

        this.password = hashed;

        next();
    } catch (err) {
        next(err);
    }
});

const StudentUser = mongoose.model("StudentUser", studentUserSchema);

module.exports = StudentUser;
