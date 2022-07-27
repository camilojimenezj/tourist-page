const mongoose = require("mongoose");
const { Schema } = mongoose;

const placeSchema = new Schema({
  title: String,
  description: Array,
  img: String,
  type: String,
});

module.exports = mongoose.model("places", placeSchema);
