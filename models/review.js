const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema({
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        default: 1,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Reviews = mongoose.model("Reviews", reviewsSchema);
module.exports = Reviews