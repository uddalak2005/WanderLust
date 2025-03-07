const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const method_override = require('method-override');
const engine = require("ejs-mate");


app.engine("ejs", engine);


app.use(express.static(path.join(__dirname, "public")));

app.use(method_override("_method"));

app.set("view engiene", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.json());

app.use(express.urlencoded({extended : true}));


dotenv.config(path.join(__dirname , ".env"));

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;


async function connectDB(){
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
} ); 

//Index Route
app.get("/listings" , async (req, res) => {
    const items = await Listing.find({});
    res.render("listings/index.ejs", {items});
})

//Show Route
app.get("/show/:_id", async(req, res) => {
    const {_id} = req.params;
    const item = await Listing.findById(_id);
    res.render("listings/show.ejs", {item});
})

//new listing form
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

//add new lisitng
app.post("/listings", async (req, res) =>{
    const {title, description, image, price, location, country } = req.body;
    const item = new Listing({title, description, image, price, location, country});
    await item.save();
    res.redirect("/listings");
})

//delete lisitng
app.delete("/listings/:_id", async(req, res) => {
    const {_id} = req.params;
    let deleted = await Listing.findByIdAndDelete(_id);
    console.log(deleted);
    res.redirect("/listings");
})

app.listen(PORT , () => {
    console.log(`server is listening to port ${PORT}`);
})