const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");

// ejs setup
const path = require("path");

// connect to database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// import listing model from model 
const Listing = require("./models/listing.js")



main()
    .then(() => {
        console.log("connected to DB");
    }).catch((err) => {
        console.log("Database connection failed:", err);
    })

async function main (){
    await mongoose.connect(MONGO_URL);
}

// ejs set up
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// it is used to parse incoming form data from HTTP requests, 
app.use(express.urlencoded({extended : true}));

// it is used for method override function
app.use(methodOverride("_method"));


// index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});


// new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


// show route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// create route
app.post("/listings", async (req, res) => {
    // one way to get the details
    // let {title, description, image, price, location, country} = req.body;
    // another way to get details
    const newListing = new Listing(req.body.listing);
    await newListing.save();  
    res.redirect("listings");  
});

// edit route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

// update route
app.put("/listings/:id", async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);

}); 

// delete route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})






// app.get("/testListing", async(req, res) => {
//     let sampleListing = new Listing({
//        title : "My new Villa",
//         description : "BY the Beach",
//         price : 1200,
//         location : "Calangute, Goa",
//         Country : "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.get("/" , (req, res) => {
    res.send("Hi, I am root");
});

app.listen(8080, ()=> {
    console.log("server is listening to the port 8080");
});