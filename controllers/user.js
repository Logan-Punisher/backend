const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const { validationResult } = require("express-validator");
const transactionSchema = require("../models/transection");
const config = require("../models/config");
const User = require("../models/user");
const reviewModel = require("../models/comments");

const signupWithGoogleFunc = async (req, res) => {
    try {
      const {
        name,
        email,
        image,
        //  dateOfBirth
      } = req.body;
      const emailExists = await userModel.findOne({ email });
      if (emailExists) {
         const token = jwt.sign({ UserId: emailExists._id }, process.env.SECRET, {
           expiresIn: "7d",
         });
         return res
           .status(200)
           .json({
             message: "Login with google successful",
             error: false,
             emailExists,
             token,
           });
      }
      // const hashedPass = await bcrypt.hash(password, 10);

      const newUser = new userModel({
        name,
        email,
        image: image,
        // dateOfBirth,
        wallet_balance: 0,
      });
      const userSave = await newUser.save();

      if (userSave) {
       const token = jwt.sign({ UserId: userSave._id }, process.env.SECRET, {
         expiresIn: "7d",
       });
       res
         .status(200)
         .json({
           message: "Login with google successful",
           error: false,
           userSave,
           token,
         });
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
const signupFunc = async (req, res) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(200).json({
        error: true,
        result: result.errors[0],
      });
    }
    const { name, email, password, dateOfBirth, phoneNumber } = req.body;
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res
        .status(200)
        .json({ message: "Email already present!", error: true });
    }
    const hashedPass = await bcrypt.hash(password, 10); //hashed here

    const newUser = new userModel({
      name,
      email,
      password: hashedPass,
      dateOfBirth,
      phoneNumber,
      wallet_balance: 0,
    });
    const userSave = await newUser.save();

    if (userSave) {
      res
        .status(200)
        .json({ message: "User created successfully!", error: false });
    } else {
      res.status(200).json({ message: "No data is submitted!", error: true });
    }
  } catch (err) {
    res.status(200).json({
      message: err.message || "something went wrong in creating user account",
      error: true,
    });
  }
};
const loginFunc = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }
    const { email, password } = req.body;
    const dbUser = await userModel.findOne({ email });
    if (!dbUser) {
      return res.status(200).json({ message: "Email not found", error: true });
    }
    const passwordMatch = await bcrypt.compare(password, dbUser.password); //unhashed and compared

    if (!passwordMatch) {
      return res
        .status(200)
        .json({ message: "Password is incorrect", error: true });
    }
    const token = jwt.sign({ UserId: dbUser._id }, process.env.SECRET, {
      expiresIn: "7d",
    });
    res
      .status(200)
      .json({ message: "Login successful", error: false, dbUser, token });
  } catch (err) {
    res
      .status(200)
      .json({ message: err.message || "Something went wrong", error: true });
  }
};
const verifyFunc = async (req, res) => {

  try {
    const { email } = req.body;
    const dbUser = await userModel.findOne({ email });

    if (!dbUser) {
      return res.status(200).json({ message: "Email not found", error: true });
    }
    if (dbUser) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      dbUser.otp = otp;
      await dbUser.save();

      console.log("Generated OTP:", otp);
      // return res
      //   .status(200)
      //   .json({ message: "otp sent to mail ID", error: false });

      // Send OTP via SMS using Twilio
      // const message = await client.messages.create({
      //   body: `hello how r u ${otp}`,
      //   from: twilioPhone,
      //   to: '+918169301845', // Replace with the user's actual phone number
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
    const dbUser = await userModel.findOne({ email: email });
    if (!dbUser) {
      return res.status(200).json({ message: "Invalid OTP!", error: true });
    }
    if (Number(dbUser.otp) === Number(otp)) {
      const token = jwt.sign({ UserId: dbUser._id }, process.env.SECRET, {
        expiresIn: "7d",
      });
      return res
        .status(200)
        .json({ message: "OTP verified!", error: false, token });
    } else {
      return res
        .status(200)
        .json({ message: "OTP does not match!", error: true });
    }
  } catch (err) {
    res.status(200).json({
      message: err.message || "Something went wrong in OTP login",
      error: true,
    });
  }
};
const getUserInfoFunc = async (req, res) => {
  try {
    const userdata = await userModel.findOne({
      _id: req.decodedToken.UserId,
    });
    res
      .status(200)
      .json({ message: "User data getuserinfo:", userdata, error: false });
  } catch (err) {
    res.status(200).json({
      message: err.message || "Something went wrong fetching userinfo",
      error: true,
    });
  }
};

const updateUserInfoFunc = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, email, dateOfBirth, phoneNumber, image } = req.body;
    const emailExists = await userModel.findOne({ email, _id: { $ne: id } });
    if (emailExists) {
      return res
        .status(200)
        .json({ message: "Email already present!", error: true });
    }
    const updateOne = await userModel.findByIdAndUpdate(
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
    const updatePassword = await userModel.findByIdAndUpdate(id, {
      password: hashedPass,
    });
    res
      .status(200)
      .json({ message: "Password changed successfully", error: false });
  } catch (err) {
    res.status(200).json({
      message: err.message || "Something went wrong in change password",
      error: true,
    });
  }
};

const showPhoneNumberFunc = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(200).json({
      error: true,
      result: result.errors[0],
    });
  }
  try {
    const { UserId } = req.decodedToken;
    const { propId } = req.query;
    const userFind = await User.findById(UserId);
    const configFind = await config.findOne({ type: "show phone number" });
    if (!userFind) {
      return res.status(200).json({ message: "user not found!", error: true });
    }
    if (userFind.wallet_balance < configFind.coin) {
      return res.status(200).json({
        message: "Insufficient wallet balance!",
        getDetails: false,
        error: true,
      });
    }
    const newBalance = userFind.wallet_balance - configFind.coin;
    userFind.wallet_balance = Number(newBalance);
    await userFind.save();
    const ShowPhoneNumber = new transactionSchema({
      transactionType: "show phone number",
      type: "debit",
      userId: req.decodedToken.UserId,
      propId,
    });
    const added = await ShowPhoneNumber.save();
    res.status(200).json({
      // userFind,
      message: "show phone number successfully",
      added,
      getDetails: true,
      error: false,
    });
  } catch (err) {
    res.status(200).json({ error: true, message: err.message });
  }
};
const getCoinsForPhoneNumber = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(200).json({
      error: true,
      result: result.errors[0],
    });
  }
  try {
    const configFind = await config.findOne({ type: "show phone number" });
    res.status(200).json({
      error: false,
      message: "fetching coins from config for show phone number",
      configDB: configFind,
    });
  } catch (err) {
    res.status(200).json({
      error: true,
      message: err.message,
    });
  }
};

const postReviewFunc = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(200).json({
      error: true,
      result: result.errors[0],
    });
  }
  try {
    const { userId } = req.decodedToken;
    const { propId, review, rating } = req.body;
    const userReview = new reviewModel({
      userId: req.decodedToken.UserId,
      propId: propId,
      review: review,
      rating: rating,
    });
    const addedReview = await userReview.save();
    res
      .status(200)
      .json({ message: "Review added", error: false, addedReview });
  } catch (err) {
    res.status(200).json({ error: true, message: err.message });
  }
};
const getPropertyReview = async (req, res) => {
  try {
    const { propId } = req.query;
    const allReviews = await reviewModel
      .find({ propId: propId })
      .populate("userId", "name image");
    if (!allReviews) {
      return res.status(200).json({ message: "Empty reviews!", error: true });
    }
    res.status(200).json({
      message: "get all reviews successfully",
      error: false,
      allReviews,
    });
  } catch (err) {
    res.status(200).json({
      message: err.message || "something went wrong in get All Review",
      error: true,
    });
  }
};
module.exports = {
  signupWithGoogleFunc,
  signupFunc,
  loginFunc,
  verifyFunc,
  verifyOTPFunc,
  getUserInfoFunc,
  updateUserInfoFunc,
  updatePasswordFunc,
  showPhoneNumberFunc,
  getCoinsForPhoneNumber,
  // review and rating function
  postReviewFunc,
  getPropertyReview,
};
