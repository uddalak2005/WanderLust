const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Lisiting = require("../models/listing.js");

dotenv.config({path: path.resolve(__dirname, "../env")});

const MONGO_URL = process.env.MONGO_URL;

async function connectDB(){
    await mongoose.connect(MONGO_URL);
}

connectDB().then(() => {
    console.log("connected to db");
}).catch(err => {
    console.log(err);
})

fs.readFile("data.json", "utf-8", async (err, data) => {
    if(err){
        console.log(err);
        return;
    }
    
    try {
        const items = JSON.parse(data);
        await Lisiting.deleteMany({});
        await Lisiting.insertMany(items);
        console.log("data inserted");
    }
    catch(err){
        console.log(err);
    }
})

