const mongoose = require("mongoose");

const contributorRequestSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  district: String,

  message: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("ContributorRequest", contributorRequestSchema);