const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
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
        eventdate: {
            type: Date,
            required: true,
        },
        numberlikes: {
            type: [],
            required: false,
        },
        numbergoing: {
            type: [],
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

const Events = mongoose.model("Events", eventSchema);

module.exports = Events;
