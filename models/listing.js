const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Reviews = require("./review.js");

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const default_link = process.env.DEFAULT_IMAGE;


const listingModel = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        filename: {
            type: String,
            default: "filename"
        },
        url: {
            type: String,
            //Why default and set defined separately? the **default** key is used when no image attribute is being passed or is null value. but **set** key is set to default_link if the value is empty string and if the value is not empty string then the value is set to the value itself(from the client side).
            // default: default_link,
            set: (v) => v === "" ? default_link : v
        }

    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Reviews'
        }
    ]
})

listingModel.post("findOneAndDelete", async(listing) => {
    if(listing && listing.reviews.length){
        const result = await Reviews.deleteMany({ _id : { $in : listing.reviews}});
        console.log(result);
    }
})

const Listing = mongoose.model("Listing", listingModel);
module.exports = Listing;