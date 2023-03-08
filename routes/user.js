const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenrateToken(email, password);
    return res.cookie("token", token).status(200).redirect("/");
  } catch (error) {
    return res.status(404).render("signin", {
      error: "Incorect Email or Password",
    });
  }
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.status(201).redirect("/user/signin");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").status(200).redirect("/");
});

module.exports = router;
