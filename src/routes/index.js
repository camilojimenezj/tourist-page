const express = require("express");
const router = express.Router();
const session = require("express-session");
const User = require("../models/user");
const Comment = require("../models/comment");
const Place = require("../models/place");
const controller = require("../upload");

// Views
router.get("/", (req, res) => {
  const name = req.session.name;
  res.render("index", { name });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/places/:type", async (req, res) => {
  const type = req.params.type;
  req.session.type = type;
  const list = await Place.find({ type: type });
  const name = req.session.name;
  res.render("routes", { list, name, type });
});

// Add place / Upload image
router.post("/place", controller.upload, async (req, res) => {
  let { title, description, type } = req.body;
  const img = "/assets/" + req.file.filename;
  description = description
    .split(".\r")
    .map((e) => e.replace(/(\r\n|\n|\r)/gm, ""));
  console.log(description);
  const newPlace = new Place({
    title,
    description,
    type,
    img,
  });
  await newPlace.save();
  res.redirect("/places/" + req.session.type);
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email: email });
  if (user) {
    if (user.password == password) {
      req.session.logged = true;
      req.session.name = user.name;
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Register
router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  let user = await User.findOne({ email: email });
  if (user) {
    res.redirect("/login");
  } else {
    const newUser = new User({
      email,
      name,
      password,
    });
    await newUser.save();
    res.redirect("/login");
  }
});

module.exports = router;
