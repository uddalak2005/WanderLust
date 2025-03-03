const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

app.set("view engiene", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({extended : true}));


dotenv.config(path.join(__dirname , ".env"));

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;


console.log(path.join(__dirname , ".env"), PORT);

async function connectDB(){
    await mongoose.connect(MONGO_URL)
}

connectDB().then(() => {
    console.log("connected to db");
}).catch(err => {
    console.log(err);
})


//Index Route
app.get("/lisitng" , async (req, res) => {
    const items = await Listing.find({});
    res.render("listings/index.ejs", {items});
})

//Show Route
app.get("/show/:_id", async(req, res) => {
    const {_id} = req.params;
    const item = await Listing.findById(_id);
    res.render("listings/show.ejs", {item});
})

app.listen(PORT , () => {
    console.log(`server is listening to port ${PORT}`);
})