var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var MessSchema = new Schema({
  usersend: {
    type: String,
  },
  message: {
    type: String,
  },
});

module.exports = mongoose.model("message", MessSchema);
