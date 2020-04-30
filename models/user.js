var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
});
UserSchema.methods.validPassword = function (pwd) {
  // EXAMPLE CODE!
  return this.password === pwd;
};
module.exports = mongoose.model("User", UserSchema);
