var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

mongoose.connect(process.env.DB_URL).then(() => {
  console.log("server connected to DB_URL");
});

module.exports = router;
