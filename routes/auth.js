const User = require("../models/user.js");
const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const joi = require("joi");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError.js");

const router = express.Router({ mergeParams: true });

//To Render Sign Up form
router.get("/signUp", wrapAsync(async (req, res) => {
    res.render("auth/signUp.ejs");
}));

//To Register a user
router.post("/signUp", wrapAsync(async (req, res) => {
    try {
        const userSchema = joi.object({
            email: joi.string().required(),
            username: joi.string().required(),
            password: joi.string().required()
        });

        const { error, value } = userSchema.validate(req.body);

        if (error) {
            console.log("Validation error", req.body);
            throw new ExpressError(400, "Validation Error", error.details);
        }


        const registeredUser = await User.register(
            new User({ email: value.email, username: value.username }),
            value.password
        );

        //Login After Sign Up
        //Login After Sign Up
        req.login(registeredUser, (err) => {
            if (err) {
                return next(new ExpressError(400, "Failed to Login"));
            }
            req.flash("success", "Welcome!");
            res.redirect("/listings");
        });

    } catch (err) {
        console.log(err.message);
        req.flash("error", err.message);
        res.redirect('/auth/signUp');
    }
}));

//To Render login Form
router.get("/login", wrapAsync(async (req, res) => {
    res.render("auth/login.ejs");
}))

//To login a registered user
router.post("/login",
    passport.authenticate('local', {
        failureRedirect: "/auth/login",
        failureFlash: true
    }),
    wrapAsync(async (req, res) => {
        res.redirect("/listings");
    }))


router.get("/logout", wrapAsync(async (req, res) => {
    req.logout((err) => {
        if (err) {
            throw new ExpressError(400, "Failed to Logout");
        }

        req.flash("success", "Logged you out");
        res.redirect("/listings");
    })
}))


module.exports = router;