const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        accountName: {
            type: String,
            required: true,
            trim: false,
        },
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
        likes: {
            type: [],
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
