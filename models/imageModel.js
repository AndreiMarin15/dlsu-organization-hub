const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    image: {
        data: Buffer,
        contentType: String,
    },

    size: Number,

    uploader: {
        type: String,
        required: true,
    },

    postID: {
        type: String,
        required: false,
    },
});

const Images = mongoose.model("Images", imageSchema);

module.exports = Images;
