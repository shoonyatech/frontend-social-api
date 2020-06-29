const mongoose = require("mongoose");

const VLogSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    link: String,
    createdBy: Object,
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("VLog", VLogSchema);
