const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for InstrumentKeys
const InstrumentKeysSchema = new Schema({
  instrument_key: {
    type: String,
    required: true,
  },
});

// Create and export the model
module.exports = mongoose.model("InstrumentKeys", InstrumentKeysSchema);
