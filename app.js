const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const method_override = require('method-override');
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");

app.engine("ejs", engine);

app.use(express.static(path.join(__dirname, "public")));

app.use(method_override("_method"));

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

dotenv.config(path.join(__dirname, ".env"));

app.use(cookieParser(process.env.SIGNED_COOKIE));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;


async function connectDB() {
    await mongoose.connect(MONGO_URL)
}

connectDB().then(() => {
    console.log("connected to db");
}).catch(err => {
    console.log(err);
})

//Home Route
app.get("/", (req, res) => {
    res.render("listings/home.ejs");
});

//Listing router
app.use("/listings", listingRouter);

//Reviews router
app.use("/listings/:_id/reviews", reviewsRouter);

//Show Route
app.get("/show/:_id", wrapAsync(
    async (req, res) => {
        const { _id } = req.params;
        const item = await Listing.findById(_id).populate("reviews");
        if (!item) {
            req.flash("error", "Listing not found");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs", { item: item });
    }
))


//For all routes that donot exist
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//Error Handling Middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Internal Server Error" } = err;
    return res.status(status).render("error/error.ejs", { err });
})


app.listen(PORT, () => {
    console.log(`server is listening to port ${PORT}`);
})