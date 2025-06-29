const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const path = require("path");

const ExpressError = require('./utils/ExpressError.js')

//Router
const listings = require('./routes/listing.js')
const reviews = require('./routes/review.js')


const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/VirtualCatalog";


main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());


app.get("/", (req, res) => {
  res.send("yes i am root");
});

app.use("/listings", listings)
app.use('/listings/:id/reviews', reviews)

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render('error.ejs', { statusCode, message });
});


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

