const mongoose = require("mongoose");

const corporateConnectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  youtubeURL: {
    type: String,
  },
  videoId: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("CorporateConnect", corporateConnectSchema);
