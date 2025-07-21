const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const joi = require("joi");

//Index Route
router.get("/", wrapAsync(
    async (req, res) => {
        const items = await Listing.find({});
        res.render("listings/index.ejs", { items });
    }
));

//new listing form
router.get("/new", wrapAsync(
    (req, res) => {
        res.render("listings/new.ejs");
    }
))

//add new lisitng
router.post("/", wrapAsync(
    async (req, res) => {
        const schema = joi.object({
            title: joi.string().required(),
            description: joi.string(),
            image: joi.string().allow('', null),
            price: joi.number().required(),
            country: joi.string().required(),
            location: joi.string().required()
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            throw new ExpressError(400, "Field Mismatch", error.details);
        }

        const { title, description, image, price, country, location } = value;

        try {
            const newListing = new Listing({
                title,
                description,
                image: {
                    filename: "listing_image",
                    url: image
                },
                price,
                location,
                country
            });
            await newListing.save();
            req.flash("success", "New Listing created Successfully!")
            return res.redirect("/listings");
        } catch (err) {
            req.flash("error", "Failed to create a listing");
            throw new ExpressError(400, err.message);
        }
    }
))

//Edit lisitng
router.get("/:_id/edit", wrapAsync(
    async (req, res) => {
        const { _id } = req.params;
        const item = await Listing.findById(_id);
        if (!item) {
            req.flash("error", "No such item found");
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { item: item });
    }
))


//Update listing
router.put("/:_id/edit", wrapAsync(
    async (req, res) => {
        try {
            const { _id } = req.params;
        } catch (err) {
            throw new ExpressError(400, "id not parsed");
        }

        const schema = joi.object({
            title: joi.string().required(),
            description: joi.string(),
            image: joi.string().allow('', null),
            price: joi.number().required(),
            country: joi.string().required(),
            location: joi.string().required()
        });

        const { error, value } = schema.validate(req.body);

        if (error) {
            throw new ExpressError(400, "Field Mismatch", error.details);
        }

        try {
            const lisitng = {
                title: value.title,
                description: value.description,
                image: {
                    filename: "filename",
                    url: value.image
                },
                price: value.price,
                location: value.location,
                country: validateHeaderValue.country
            };

            await Listing.findByIdAndUpdate(_id, lisitng);

        } catch (err) {
            throw new ExpressError(400, err.message);
        }

        res.redirect("/listings");
    }
))

//delete lisitng
router.delete("/:_id", wrapAsync(
    async (req, res) => {
        const { _id } = req.params;
        let deleted = await Listing.findByIdAndDelete(_id);

        if(!deleted){
            req.flash("error", "Listing not found");
            res.redirect("/listings");
        }

        console.log(deleted);
        req.flash("success", "Listing Deleted Successfully!")
        res.redirect("/listings");
    }
))

module.exports = router;