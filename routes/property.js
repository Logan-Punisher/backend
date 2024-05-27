var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const propertyController = require("../controllers/property");
const auth = require("../libs/auth_owner");

const propertyValidate = [
  check("type", "Type field is required").notEmpty(),
  check("title", "title field is required").notEmpty(),
  check("country", "Country field is required").notEmpty(),
  check("street", "Street field is required").notEmpty(),
  check("city", "City field is required").notEmpty(),
  check("state", "State field is required").notEmpty(),
  check("postal_code", "Postal code field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  // check("lattitude", "Lattitude field is required").notEmpty(),
  // check("longitude", "Longitude field is required").notEmpty(),
  check("acreage", "Acreage field is required").notEmpty(),
  check("guests", "Guests field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("bedrooms", "Bedrooms field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("beds", "Beds field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("bathrooms", "Bathrooms field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("kitchen", "Kitchen field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("amenities", "Amenities must be an array of strings")
    .optional()
    .isArray()
    .custom((value) => value.every((item) => typeof item === "string")),
  check("pet", "Pet field is required and must be a boolean")
    .notEmpty()
    .isBoolean(),
  check(
    "party_organizing",
    "Party organizing field is required and must be a boolean"
  )
    .notEmpty()
    .isBoolean(),
  check("cooking", "Cooking field is required and must be a boolean")
    .notEmpty()
    .isBoolean(),
  check("smoking", "Smoking field is required and must be a boolean")
    .notEmpty()
    .isBoolean(),
  check("drinking", "Drinking field is required and must be a boolean")
    .notEmpty()
    .isBoolean(),
  check("additional_rules", "Additional rules must be an array of strings")
    .optional()
    .isArray()
    .custom((value) => value.every((item) => typeof item === "string")),
  check(
    "place_descriptions",
    "Place descriptions field is required"
  ).notEmpty(),
  check("monday", "Monday field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("tuesday", "Tuesday field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("wednesday", "Wednesday field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("thursday", "Thursday field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("friday", "Friday field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("saturday", "Saturday field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("sunday", "Sunday field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("night_min", "Night min field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("night_max", "Night max field is required and must be a number")
    .notEmpty()
    .isNumeric(),
  check("cover_image", "Cover image field is required").notEmpty(),
  check("galleryImgs", "Gallery images must be an array of strings")
    .optional()
    .isArray()
    .custom((value) => value.every((item) => typeof item === "string")),
];
const bookingValidation = [
  check("guestName", "Guest name field is required").notEmpty(),
  check("phoneNumber", "Please enter a valid phone number")
    .notEmpty()
    .isMobilePhone("en-IN"),
  check("numberOfGuests", "Add atlease 1 guest")
    .notEmpty()
    .isInt({ min: 1 }),
  check("startDate", "Start date field is required").notEmpty(),
  check("endDate", "End date field is required").notEmpty(),
  check("amount", "Amount must be a positive number").notEmpty().isNumeric({
    min: 0,
  }),
  check("paidAmount", "Paid amount must be a non-negative number")
    .notEmpty()
    .isNumeric({
      min: 0,
    }),
  check("status", "Invalid status value").optional().isIn(["wait", "confirm"]),
];
router.post("/get-property", (req, res) => {
  propertyController.getAllPropertyFunc(req, res);
});
router.get("/get-owner-property", auth, (req, res) => {
  propertyController.getOwnerPropertyFunc(req, res);
});
router.post("/add-property", auth, propertyValidate, function (req, res) {
  propertyController.addPropertyFunc(req, res);
});
router.post("/update-property", auth, (req, res) => {
  propertyController.updatePropertyFunc(req, res);
});
router.get("/delete-property", (req, res) => {
  propertyController.deletePropertyFunc(req, res);
});
router.get("/get-property-details", auth, (req, res) => {
  propertyController.getOnePropertyDetails(req, res);
});
router.get("/get-propertyCard-details", (req, res) => {
  propertyController.getOnePropertyCardDetails(req, res);
});
router.post("/book-property", auth, bookingValidation, function (req, res) {
  propertyController.bookPropertyFunc(req, res);
});
router.get("/delete-booking-property", auth, (req, res) => {
propertyController.deleteBookedPropertyFunc(req, res);
})


module.exports = router;
