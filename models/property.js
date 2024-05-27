const mongoose = require("mongoose");

const numberType = {
  type: Number,
  required: true,
};
const stringType = {
  type: String,
  required: true,
};

const PropertyModel = new mongoose.Schema({
  ownerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
  },
  type: stringType,
  subtype: stringType,
  title: stringType,
  country: stringType,
  street: stringType,
  room_number: Number,
  city: stringType,
  state: stringType,
  postal_code: numberType,
  lattitude: String,
  longitude: String,
  acreage: String,
  guests: numberType,
  bedrooms: numberType,
  beds: numberType,
  bathrooms: numberType,
  kitchen: numberType,
  amenities: [String],
  pet: Boolean,
  party_organizing: Boolean,
  cooking: Boolean,
  smoking: Boolean,
  drinking: Boolean,
  additional_rules: [String],
  place_descriptions: stringType,
  monday: { type: Number, required: true },
  tuesday: { type: Number, required: true },
  wednesday: { type: Number, required: true },
  thursday: { type: Number, required: true },
  friday: { type: Number, required: true },
  saturday: { type: Number, required: true },
  sunday: { type: Number, required: true },
  night_min: numberType,
  night_max: numberType,
  cover_image: stringType,
  galleryImgs: [String],
});

const Property = mongoose.model("property", PropertyModel);
module.exports = Property;
