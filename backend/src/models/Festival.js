const mongoose = require("mongoose");

const festivalSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  month: {
    type: String
  },

  date: {
    type: String
  },

  description: {
    type: String
  },

  deity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deity"
  },

  image: {
    type: String
  },

  isMajorFestival: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Festival", festivalSchema);