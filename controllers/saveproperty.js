const UserPropertySchema = require("../models/savedproperty");
const { validationResult } = require("express-validator");

const addToFavorites = async (req, res) => {
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(200).json({
          error: true,
          result: result.errors[0],
        });
      }
  try {
    const { userId }= req.decodedToken;
    const { propId } = req.body;
    const existingFavorite = await UserPropertySchema.findOne({
      userId,
      propId,
    });

    if (existingFavorite) {
      return res
        .status(200)
        .json({ message: "Property is already in favorites", error: true });
    }
    const userProperty = new UserPropertySchema({
      userId: req.decodedToken.UserId,
      propId,
    });
    const added = await userProperty.save();
    res
      .status(200)
      .json({ added, message: "Property added to favorites", error: false });
  } catch (err) {
    res.status(200).json({ error: true, message: err.message });
  }
};
const getUserFavorites = async (req, res) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
          return res.status(200).json({
            error: true,
            result: result.errors[0],
          });
        }
  try {
    const userProperties = await UserPropertySchema.find({
      userId: req.decodedToken.UserId,
    }).populate("propId");
    const favourites = userProperties.map((userProperty) => userProperty.propId);
    res
      .status(200)
      .json({ favourites, message: "property found", error: false });
  } catch (err) {
        res.status(200).json({ error: true, message: err.message });
  }
};
const removeFromFavorites = async (req, res) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
          return res.status(200).json({
            error: true,
            result: result.errors[0],
          });
        }
  try {
    const { propId } = req.body;
    const deletedProperty = await UserPropertySchema.findOneAndDelete({
      userId: req.decodedToken.UserId,
      propId,
    });
    if (deletedProperty) {
      res
        .status(200)
        .json({ message: "Property removed from favorites", error: false });
    } else {
      res.status(200).json({ message: "property not found", error: true });
    }
  } catch (err) {
    res.status(200).json({ error: true, message: err.message });
  }
};

module.exports = {
  addToFavorites,
  getUserFavorites,
  removeFromFavorites,
};
