const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const joi = require("joi");
const { isLoggedIn, permissionForReviews } = require("../middlewares/authMiddleware.js");

//adding reviews route
router.post("/",
    isLoggedIn,
    wrapAsync(
        async (req, res) => {
            const { _id } = req.params;

            const schema = joi.object({
                rating: joi.number().min(1).max(5),
                review: joi.string().required()
            });

            const { error, value } = schema.validate(req.body);

            if (error) {
                throw new ExpressError(400, "Validation Error", error.details);
            }

            const newReview = new Reviews({
                rating: value.rating,
                review: value.review,
                author: req.user._id
            });

            const savedReview = await newReview.save();

            const listingRecord = await Listing.findById(_id);

            if (!listingRecord) {
                throw new ExpressError(400, "listing not found");
            }

            listingRecord.reviews.push(savedReview._id);

            await listingRecord.save();

            req.flash("success", "Review added successfully");
            res.redirect(`/show/${_id}`);
        }
    ));


router.delete("/listing/:_id/reviews/:_revId",
    isLoggedIn,
    permissionForReviews,
    wrapAsync(
        async (req, res) => {
            const { _id } = req.params;
            const { _revId } = req.params;

            const listingRecord = await Listing.findById(_id);

            if (!listingRecord) {
                req.flash("error", "Listing not found");
                throw new ExpressError(400, "lisiting not found");
            }

            const deletedReview = await Reviews.findByIdAndDelete(_revId);

            if (!deletedReview) {
                req.flash("error", "Failed to delete a non existing review");
                throw new ExpressError(400, "review not found so cannot be deleted");
            }

            await Listing.findByIdAndUpdate(
                _id,
                {
                    $pull: {
                        reviews: deletedReview._id
                    }
                },
                { new: true, upsert: true }
            );

            req.flash("success", "Successfully deleted review");
            res.redirect(`/show/${_id}`);
        }
    ))

module.exports = router;