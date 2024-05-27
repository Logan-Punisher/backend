var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const ownerController = require("../controllers/owner");
const auth = require("../libs/auth_owner");

const signupCheck = [
  check("name", "Name field is required").notEmpty(),
  check("email", "Please enter valid email").isEmail().notEmpty(),
  check("password", "Please enter password of minimum 8 characters")
    .notEmpty()
    .isLength({ min: 8 }),
  check("phoneNumber")
    .notEmpty()
    .isLength({ min: 10 })
    .isMobilePhone("en-IN")
    .withMessage("Please enter a valid phone number"),
];
const loginCheck = [
  check("email", "Please enter valid email").isEmail().notEmpty(),
  check("password", "Please enter password of minimum 8 characters")
    .notEmpty()
    .isLength({ min: 8 }),
];
const updatePassCheck = [
  check("password", "Please enter password of minimum 8 characters")
    .notEmpty()
    .isLength({ min: 8 }),
];

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/signupwithgoogle", function (req, res) {
  ownerController.signupWithGoogleFunc(req, res);
});
router.post("/owner-signup", signupCheck, function (req, res) {
  ownerController.ownerSignupFunc(req, res);
});
router.post("/owner-login", loginCheck, (req, res) => {
  ownerController.ownerLoginFunc(req, res);
});
router.get("/getowner", auth, (req, res) => {
  ownerController.getOwnerInfoFunc(req, res);
});
router.post("/owner-verify", (req, res) => {
  ownerController.verifyFunc(req, res);
});
router.post("/owner-verifyotp", (req, res) => {
  ownerController.verifyOTPFunc(req, res);
});
router.post("/updateInfo", auth, (req, res) => {
  ownerController.updateOwnerInfoFunc(req, res);
});
router.post("/updatePass", updatePassCheck, (req, res) => {
  ownerController.updatePasswordFunc(req, res);
});
module.exports = router;
