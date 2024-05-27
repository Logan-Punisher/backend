const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owner");
const { validationResult } = require("express-validator");

const signupWithGoogleFunc = async (req, res) => {
  try {
    const {
      name,
      email,
      image,
      //  dateOfBirth
    } = req.body;
    const emailExists = await ownerModel.findOne({ email });
    if (emailExists) {
      const token = jwt.sign({ ownerId: emailExists._id }, process.env.SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).json({
        message: "Login with google successful",
        error: false,
        emailExists,
        token,
      });
    }
    // const hashedPass = await bcrypt.hash(password, 10);

    const newowner = new ownerModel({
      name,
      email,
      image: image,
      // dateOfBirth,
      // wallet_balance: 0,
    });
    const ownerSave = await newowner.save();
    if (ownerSave) {
      const token = jwt.sign({ ownerId: ownerSave._id }, process.env.SECRET, {
        expiresIn: "7d",
      });
      res
        .status(200)
        .json({ message: "Owner created successfully!",token, error: false });
    } else {
      res.status(200).json({ message: "No data is submitted!", error: true });
    }
  } catch (err) {
    res.status(200).json({
      message: err.message || "something went wrong while signing with google",
      error: true,
    });
  }
};
const ownerSignupFunc = async (req, res) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(200).json({
        error: true,
        result: result.errors[0],
      });
    }
    const { name, email, password, dateOfBirth, phoneNumber } = req.body;

    const emailExists = await ownerModel.findOne({ email });
    if (emailExists) {
      return res
        .status(200)
        .json({ message: "Email already present!", error: true });
    }
    const hashedPass = await bcrypt.hash(password, 10); //hashed here

    const newowner = new ownerModel({
      name,
      phoneNumber,
      email,
      password: hashedPass,
      dateOfBirth,
    });
    const ownerSave = await newowner.save();

    if (ownerSave) {
      // const token = jwt.sign({ ownerId: ownerSave._id }, process.env.SECRET, {
      //   expiresIn: "7d",
      // });
      res
        .status(200)
        .json({ message: "Owner created successfully!", error: false });
    } else {
      res.status(200).json({ message: "No data is submitted!", error: true });
    }
  } catch (err) {
    res.status(200).json({
      message: err.message || "Something went wrong in creating owner account",
      error: true,
    });
  }
};

const ownerLoginFunc = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }
    const { email, password } = req.body;
    const dbOwner = await ownerModel.findOne({ email });
    if (!dbOwner) {
      return res.status(200).json({ message: "Email not found", error: true });
    }
    const passwordMatch = await bcrypt.compare(password, dbOwner.password); //unhashed and compared

    if (!passwordMatch) {
      return res
        .status(200)
        .json({ message: "Password is incorrect", error: true });
    }
    const token = jwt.sign({ ownerId: dbOwner._id }, process.env.SECRET, {
      expiresIn: "7d",
    });
    res
      .status(200)
      .json({ message: "Login successful", error: false, dbOwner, token });
  } catch (err) {
    res
      .status(200)
      .json({ message: err.message || "Something went wrong", error: true });
  }
};
const getOwnerInfoFunc = async (req, res) => {
  try {
    const ownerdata = await ownerModel.findOne({
      _id: req.decodedToken.ownerId,
    });
    res
      .status(200)
      .json({ message: "user data getuserinfo:", ownerdata, error: false });
  } catch (err) {
    res
      .status(200)
      .json({ message: err.message || "Something went wrong", error: true });
  }
};
const verifyFunc = async (req, res) => {

  try {
    const { email } = req.body;
    const dbOwner = await ownerModel.findOne({ email: email });

    if (!dbOwner) {
      return res.status(200).json({ message: "Email not found", error: true });
    }
    if (dbOwner) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      dbOwner.otp = otp;
      await dbOwner.save();

      console.log("Generated OTP:", otp);
      // return res
      //   .status(200)
      //   .json({ message: "otp sent to mail ID", error: false });

      // Send OTP via SMS using Twilio
      // const message = await client.messages.create({
      //   body: `hello how r u ${otp}`,
      //   from: twilioPhone,
      //   to: '<your phone number here>', // Replace with the user's actual phone number
      // });

      // console.log('Twilio response:', message);

      return res
        .status(200)
        .json({ message: "OTP sent to the phone number", error: false });
    }
  } catch (err) {
    res.status(200).json({
      message: err.message || "Something went wrong in forget password",
      error: true,
    });
  }
};
const verifyOTPFunc = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const dbOwner = await ownerModel.findOne({ email: email });
    if (!dbOwner) {
      return res.status(200).json({ message: "Invalid OTP!", error: true });
    }
    if (Number(dbOwner.otp) === Number(otp)) {
      const token = jwt.sign({ ownerId: dbOwner._id }, process.env.SECRET, {
        expiresIn: "7d",
      });
      res.status(200).json({
        message: "OTP login successful!",
        error: false,
        dbOwner,
        token,
      });
    } else {
      return res
        .status(200)
        .json({ message: "OTP does not match!", error: true });
    }
  } catch (err) {
    res.status(200).json({
      message: err.message || "Something went wrong in otp login",
      error: true,
    });
  }
};
const updateOwnerInfoFunc = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, email, dateOfBirth, phoneNumber, image } = req.body;
    const emailExists = await ownerModel.findOne({ email, _id: { $ne: id } });
    if (emailExists) {
      return res
        .status(200)
        .json({ message: "Email already present!", error: true });
    }
    const updateOne = await ownerModel.findByIdAndUpdate(
      id,
      { name, email, dateOfBirth, phoneNumber, image },
      { new: true }
    );
    res.status(200).json({ message: "Updated successfully!", error: false });
  } catch (err) {
    res.status(200).json({
      message: err.message || "Something went wrong in updating user",
      error: true,
    });
  }
};

const updatePasswordFunc = async (req, res) => {
  try {
    const { id } = req.query;
    const { password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10); //hashed here
    const updatePassword = await ownerModel.findByIdAndUpdate(id, {
      password: hashedPass,
    });
    res
      .status(200)
      .json({ message: "password changed successfully", error: false });
  } catch (err) {
    res.status(200).json({
      message: err.message || "something went wrong in change password",
      error: true,
    });
  }
};
module.exports = {
  ownerSignupFunc,
  ownerLoginFunc,
  getOwnerInfoFunc,
  verifyFunc,
  verifyOTPFunc,
  updateOwnerInfoFunc,
  updatePasswordFunc,
  signupWithGoogleFunc,
};
