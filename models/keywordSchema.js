const mongoose = require("mongoose");
const configSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  keywords: {
    type: Array,
    default: [],
  },
  roles: {
    type: Array,
    default: [],
  },
  logsChannel: {
    type: String,
  },
  rolePing: {
    type: String,
  },
});

// Create a mongoose model for the collection
module.exports = mongoose.model("configSchema", configSchema);
