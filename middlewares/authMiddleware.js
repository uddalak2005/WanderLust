const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");

const isLoggedIn = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Login to gain access");
        return res.redirect("/auth/login");
    }
    next();
}

//But req.session is rest by passport after successfull login so we need another middleware to store the session data somewhere just before login. So we can use res.locals to save the original URL. the res.locals can store the redirect URl for one request response cycle then after passport resets the session then the isLoggedIn middleware can do its job via sessions.
const saveRedirectUrl = async (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//Permission for listing
const permissionForLisiting = async (req, res, next) => {
    const { _id } = req.params;

    const requiredListing = await Listing.findById(_id);

    if (!requiredListing) {
        req.flash("error", "The requested listing doesn't exist.");
        return res.redirect("/listings");
    }

    if (!requiredListing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to delete this listing");
        return res.redirect("/listings");
    }

    next();
}

const permissionForReviews = async (req, res, next) => {
    const { _revId } = req.params;
    const deletedReview = await Reviews.findById(_revId);

    if (!deletedReview) {
        req.flash("error", "The requested review doesn't exist.");
        return res.redirect("/listings");
    }

    if (!deletedReview.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to delete this review");
        return res.redirect("/listings");
    }

    next()
}


module.exports = {
    isLoggedIn,
    saveRedirectUrl,
    permissionForLisiting,
    permissionForReviews
}