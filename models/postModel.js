const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: false,
        },
        numberlikes: {
            type: Number,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
