const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = await userModel.findById(decodedToken.UserId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "wrong credentials,need login", error });
  }
};
