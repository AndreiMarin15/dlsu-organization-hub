const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
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
        eventdate: {
            type: Date,
            required: false,
        },
        likes: {
            type: [],
            required: false,
        },
        going: {
            type: [],
            required: false,
        },
        date: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Events = mongoose.model("Events", eventSchema);

module.exports = Events;
