const express = require("express");
const mongoose = require("mongoose");
const dropBoxRoute = require("./routes/dropBoxRoute");
const userRoute = require("./routes/user");
const cookiepaser = require("cookie-parser");
const dropBox = require("./models/dropBoxSchema");
const path = require("path");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();

const port = 5000;

mongoose
  .connect("mongodb://localhost:27017/dropBox")
  .then((e) => console.log("mongoDB conected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiepaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  try {
    const alldropBoxs = await dropBox.find({});
    res.render("home", {
      user: req.user,
      dropBoxs: alldropBoxs,
    });
  } catch (error) {
    throw new Error(error);
  }
});

app.use("/", dropBoxRoute);
app.use("/user", userRoute);

app.listen(port, () => {
  console.log("app is working");
});
